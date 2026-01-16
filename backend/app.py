from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import firebase_admin
from firebase_admin import credentials, auth
from transcriber import transcribe_audio
from groq_summarizer import groq_summarize
import json

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"],
)

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        return response, 200

# --- FIREBASE INITIALIZATION ---
# Make sure serviceAccountKey.json is in your backend folder!
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

def verify_token(id_token):
    """Utility to verify Firebase ID token from request headers"""
    try:
        if not id_token:
            return None
        # Handle "Bearer <token>" format
        if id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token  # Contains uid, email, etc.
    except Exception as e:
        print(f"Auth Error: {e}")
        return None

# --- API ROUTES ---

@app.route('/api/upload', methods=['POST'])
def upload_audio():
    # 1. AUTH CHECK
    user = verify_token(request.headers.get('Authorization'))
    if not user:
        return jsonify({'error': 'Unauthorized: Please sign in'}), 401

    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio_file.filename)[1]) as temp_file:
            audio_file.save(temp_file.name)
            temp_path = temp_file.name
        
        try:
            transcript = transcribe_audio(temp_path)
            notes = groq_summarize(transcript)
            
            return jsonify({
                'success': True,
                'transcript': transcript,
                'notes': notes,
                'user_id': user['uid'] # Optional: return UID for confirmation
            })
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
 


@app.route('/api/delete-account', methods=['POST'])
def delete_account():
    # 1. AUTH CHECK - Verify the user making the request
    user = verify_token(request.headers.get('Authorization'))
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    uid = user['uid']

    try:
        # 2. DELETE FROM FIRESTORE (Optional but recommended for cleanup)
        # Using the firebase_admin firestore client
        from firebase_admin import firestore
        db_admin = firestore.client()
        
        # Delete user profile document
        db_admin.collection('users').document(uid).delete()
        
        # 3. DELETE FROM FIREBASE AUTH
        # This is the "Admin" way that ignores the 'recent login' rule
        auth.delete_user(uid)

        return jsonify({'success': True, 'message': 'Account deleted successfully'})
    except Exception as e:
        print(f"Delete Account Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500    

@app.route('/api/generate-quiz', methods=['POST'])
def generate_custom_quiz():
    # AUTH CHECK
    user = verify_token(request.headers.get('Authorization'))
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        data = request.get_json()
        transcript = data.get('transcript')
        difficulty = data.get('difficulty', 'medium')
        count = data.get('count', 5)

        if not transcript:
            return jsonify({'success': False, 'error': 'Transcript required'}), 400

        # ✅ IMPROVED PROMPT
        custom_prompt = f"""Generate exactly {count} multiple-choice quiz questions based on this lecture transcript.

Difficulty Level: {difficulty.upper()}

IMPORTANT RULES:
1. Return ONLY valid JSON (no markdown, no extra text)
2. Use this EXACT structure:
{{
  "quizQuestions": [
    {{
      "question": "What is the main concept discussed?",
      "options": [
        "A) First option",
        "B) Second option", 
        "C) Third option",
        "D) Fourth option"
      ],
      "answer": "A) First option"
    }}
  ]
}}

3. Make questions relevant to the lecture content
4. For {difficulty} difficulty:
   - easy: Focus on basic facts and definitions
   - medium: Focus on understanding and application
   - hard: Focus on analysis and critical thinking

5. Each question must have exactly 4 options (A, B, C, D)
6. The answer must match one of the options exactly (including the letter)

Lecture Transcript:
{transcript[:12000]}

Remember: Return ONLY the JSON object, nothing else."""
        
        # Call Groq with custom prompt
        quiz_data = groq_summarize("", custom_prompt=custom_prompt)
        
        # ✅ DEBUG LOGGING
        print("=" * 60)
        print("QUIZ GENERATION DEBUG:")
        print(f"Difficulty: {difficulty}, Count: {count}")
        print(f"Groq Response Type: {type(quiz_data)}")
        print(f"Groq Response Keys: {quiz_data.keys() if isinstance(quiz_data, dict) else 'Not a dict'}")
        print(f"Groq Response: {json.dumps(quiz_data, indent=2)}")
        print("=" * 60)
        
        # Parse the response
        if isinstance(quiz_data, dict) and 'quizQuestions' in quiz_data:
            questions = quiz_data['quizQuestions']
        elif isinstance(quiz_data, dict) and 'error' in quiz_data:
            return jsonify({'success': False, 'error': quiz_data['error']}), 500
        else:
            # Unexpected format
            print(f"ERROR: Unexpected quiz_data format: {quiz_data}")
            return jsonify({
                'success': False, 
                'error': 'Failed to generate quiz in correct format'
            }), 500
        
        # Validate questions
        if not isinstance(questions, list) or len(questions) == 0:
            return jsonify({
                'success': False,
                'error': 'No questions generated'
            }), 500
        
        print(f"✅ Successfully generated {len(questions)} questions")
        
        return jsonify({
            'success': True,
            'quiz': {'quizQuestions': questions}
        })
        
    except Exception as e:
        print(f"❌ ERROR in generate_custom_quiz: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500
    
    

@app.route('/api/process-transcript', methods=['POST'])
def process_transcript():
    # AUTH CHECK (Keep your existing auth code)
    auth_header = request.headers.get('Authorization')
    token = auth_header.replace("Bearer ", "") if auth_header else None
    user = verify_token(token)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        data = request.get_json()
        transcript = data.get('transcript')

        if not transcript or not transcript.strip():
            return jsonify({'error': 'Transcript is empty'}), 400

        # Call AI
        notes = groq_summarize(transcript)

        # CHECK IF AI RETURNED AN ERROR DICTIONARY
        if isinstance(notes, dict) and "error" in notes:
            return jsonify({
                'success': False, 
                'error': notes["error"]
            }), 500

        # Ensure we return 'quizQuestions' even if empty to satisfy Index.tsx types
        if "quizQuestions" not in notes:
            notes["quizQuestions"] = []

        return jsonify({
            'success': True,
            'transcript': transcript,
            'notes': notes
        })

    except Exception as e:
        print(f"CRASH IN PROCESS_TRANSCRIPT: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
    
    
@app.route('/api/verify-fact', methods=['POST'])
def verify_fact():
    # 1. AUTH CHECK
    user = verify_token(request.headers.get('Authorization'))
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        data = request.get_json()
        transcript = data.get('transcript')
        query = data.get('query')

        if not transcript or not query:
             return jsonify({'success': False, 'error': 'Transcript and query are required'}), 400

        short_transcript = transcript[:3000]
        
        verify_instruction = f"""
        Answer the student's question based ONLY on the transcript provided.
        Question: {query}
        Transcript: {short_transcript}
        Return JSON: {{"answer": "your response here"}}
        """
        
        result = groq_summarize("", custom_prompt=verify_instruction)
        answer = result.get("answer") if isinstance(result, dict) else "Unable to verify."
       
        return jsonify({'success': True, 'answer': answer})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
    
 