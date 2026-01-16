
import os
import time
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# Load and validate API key
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables")

client = Groq(api_key=api_key)


def groq_summarize(text, custom_prompt=None, max_retries=3):
    """
    Generate AI summaries with dynamic, context-aware formatting
    """
    # Limit text length to avoid context window issues
    max_chars = 12000
    if len(text) > max_chars:
        text = text[:max_chars]

    # If a custom prompt is provided, use it (for quiz, fact-check, etc.)
    if custom_prompt:
        final_prompt = custom_prompt
        use_json_mode = True
    else:
        # ENHANCED PROMPT: ChatGPT-style dynamic formatting
        final_prompt = f"""You are a professional Academic Scribe and Session Analyst.Your task is to analyze this transcript and report on exactly what was discussed, 
maintaining an active, observational perspective..You are an expert AI assistant like ChatGPT or Claude, known for explaining complex topics clearly and naturally.

Your task: Analyze this lecture/content and explain it to a student in the BEST way possible what the speaker had told.

CRITICAL INSTRUCTIONS:

1. USE THE ACTIVE VOICE (REPORTING STYLE)
   - Start sections with phrases like "The speaker introduces...", "The session explores...", or "The lecture demonstrates..."
   - Frame the content as a summary of a specific event that took place.
   - Example: Instead of "Encryption is...", write "The speaker explains the role of encryption in..."

2. ADAPT YOUR FORMAT TO THE CONTENT
   - If it's a comparison → Use tables
   - If it's a tutorial/process → Use numbered steps
   - If it's conceptual → Use headers with paragraphs
   - If it's technical → Include code blocks if relevant
   - Be SMART about structure, don't follow a rigid template

3. USE MARKDOWN FORMATTING NATURALLY
   - ## Main Section Headers (when it helps understanding)
   - ### Subsection Headers (for breaking down topics)
   - **Bold** for key terms and important concepts
   - Tables for comparisons:
     | Header 1 | Header 2 |
     |----------|----------|
     | Data     | Data     |
   - Bullet points for lists (-, *, or •)
   - Numbered lists for steps or sequences
   - Code blocks for technical content (if applicable)

4. WRITE LIKE YOU'RE EXPLAINING TO A FRIEND
   - Natural, conversational tone
   - Clear explanations, not jargon-heavy
   - Make it EASY to understand
   - Focus on what matters most

5. STRUCTURE GUIDELINES (NOT RIGID RULES)
   - Start with a brief overview (1-2 sentences)
   - Break into logical sections with headers
   - Use formatting that HELPS comprehension
   - End with key takeaways if appropriate

6. WHAT TO AVOID
   - Don't mention timestamps
   - Don't describe the video/lecture format itself
   - Don't say "This video discusses..." or "The speaker mentions..."
   - Don't use the same structure for every topic
   - Don't be overly formal or academic unless the content demands it

7. QUALITY STANDARDS
   - Make it scan-friendly (easy to skim)
   - Highlight what's important
   - Use white space effectively (with line breaks)
   - Think: "Would this help a student study efficiently?"

CONTENT TYPE EXAMPLES:

Comparison Topic → Use tables + pros/cons
Tutorial/How-to → Use numbered steps + sub-points
Conceptual Explanation → Use headers + paragraphs + bullet points
Technical Topic → Use code examples + structured sections
Historical/Narrative → Use timeline or story flow

Now, analyze this content and create the BEST possible explanation:

---
TRANSCRIPT:
{text}
---

OUTPUT FORMAT (JSON):
{{
  "summary": "Your beautifully formatted markdown explanation here (with ##, ###, tables, lists, **bold**, etc.)",
  "keyPoints": [
    "Concise takeaway 1",
    "Concise takeaway 2",
    "Concise takeaway 3"
    .
    .
    .
    "concise takeaway n"
  ],
  "flashcards": [
    {{
      "front": "Concept or question",
      "back": "Clear, simple explanation"
    }}
  ]
}}

REMEMBER: The summary should look like something ChatGPT or Claude would write - natural, well-structured, and adapted to the content type. Make it EXCELLENT."""

    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert educator and AI assistant that creates beautifully formatted, context-aware explanations. You adapt your formatting style to match the content type and always prioritize clarity and comprehension."
                    },
                    {
                        "role": "user",
                        "content": final_prompt
                    }
                ],
                temperature=0.4,  # Slightly higher for more natural writing
                max_tokens=4000,  # Increased for longer, well-formatted summaries
                response_format={"type": "json_object"},
                timeout=120
            )
            
            # Parse response into Python dict
            content = response.choices[0].message.content
            parsed_response = json.loads(content)
            
            # ✅ DEBUG: Log what we're returning
            if custom_prompt:
                print(f"[groq_summarizer] Custom prompt response keys: {parsed_response.keys()}")
            
            # Validate response structure for default mode
            if not custom_prompt:
                if "summary" not in parsed_response:
                    parsed_response["summary"] = "Summary generation failed"
                if "keyPoints" not in parsed_response:
                    parsed_response["keyPoints"] = []
                if "flashcards" not in parsed_response:
                    parsed_response["flashcards"] = []
            
            return parsed_response

        except Exception as e:
            if attempt < max_retries - 1:
                print(f"Attempt {attempt + 1} failed, retrying...")
                time.sleep(2)
                continue

            print(f"Final Groq Error: {str(e)}")
            return {
                "error": "Failed to connect to AI service",
                "summary": "Failed to generate summary",
                "keyPoints": ["Error occurred during processing"],
                "flashcards": []
            }

        