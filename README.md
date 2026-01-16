# 🎓 **Lecture Voice-to-Notes Generator**

An intelligent web application that transcribes audio, generates summarized lecture notes, creates interactive quizzes, and performs security analysis using Groq AI and Firebase.
<br><br>

### 🚀 **Features**
---

**Audio Transcription:** Upload audio files and get high-accuracy text transcripts.

**AI Summarization:** Automatically generate structured notes from long lectures.

**Interactive Quizzes:** AI-generated multiple-choice questions based on transcript content.

**Fact Verification:** Ask specific questions about the lecture and get AI-verified answers.

**Secure Authentication:** Integrated with Firebase Auth for user management and data security.

**Account Management:** Full control over user data, including secure account deletion.

<br><br>

### **🛠️ Tech Stack**
----


**Frontend**

React (Vite) + TypeScript

Tailwind CSS (for styling)

Firebase SDK (Authentication & Firestore)

**Backend**

Python (Flask)

Groq Cloud API (LLM for summarization and quiz generation)

Firebase Admin SDK


<br><br>

### **⚙️ Installation & Setup**
---
#### 1.Clone the Repository
   
<pre>git clone https://github.com/your-username/your-repo-name.git </pre>
	
<pre> cd your-repo-name </pre>
  
#### **2.Backend Setup**

Navigate to the backend folder.

Create a virtual environment: python -m venv .venv

**Install dependencies:** pip install -r requirements.txt

Create a .env file and add:
<pre>

GROQ_API_KEY=your_groq_key

FIREBASE_PROJECT_ID=your_id

FIREBASE_PRIVATE_KEY="your_private_key"

FIREBASE_CLIENT_EMAIL=your_email
	</pre>

#### **3. Frontend Setup**
Navigate to the frontend folder.

Install dependencies: npm install


Create a .env file and add:

&emsp;VITE_FIREBASE_API_KEY=your_key

<br><br>

### **💻 Local Development**
---

To run the project locally, follow these steps:

#### 1.Start the Backend (Flask)
   
Navigate to the backend directory, activate your virtual environment, and run the server:


**In the backend folder**

   <pre> python app.py</pre>

#### 2.Start the Frontend (React/Vite) 

Open a new terminal, navigate to the frontend directory, and start the development server:


**In the frontend folder**

<pre>npm run dev</pre>
<br><br>
### 🔗 Live Demo
---
Check out the live application here: [Lecture Notes AI](https://frontend-lecture-notes-ai-lecture-t.vercel.app/)

### 👤 Author

Umesh Kesa
Student |  Cybersecurity AI & Enthusiast
