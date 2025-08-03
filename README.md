📧 AI-Powered Gmail Assistant

    An intelligent Gmail Assistant built with React (Vite + TailwindCSS) and FastAPI (Python). This assistant helps you:
    
    View & manage your Gmail inbox with a beautiful dashboard.
    
    Perform Smart Search using AI (Groq/OpenAI).
    
    Summarize emails & generate replies.
    
    Toggle Read/Unread & Starred status visually.
    
    Login securely using Google OAuth.

🚀 Features

    ✨ Google OAuth 2.0 Login
    
    📊 Glassmorphism UI Dashboard
    
    🔍 Smart Search (AI-Powered NLP Queries)
    
    📨 Summarize Emails with AI
    
    ✍️ Generate AI-based Replies
    
    🌟 Star / Unstar Emails in UI
    
    📩 Toggle Read / Unread Status

🛠️ Tech Stack

    Frontend: React + Vite + TailwindCSS + Lucide Icons
    
    Backend: FastAPI + Python
    
    Google API: Gmail API (OAuth2.0)
    
    AI API: Groq API (Llama3-70B)

🗂️ Folder Structure

    📁 inbox-lumina/
    ├── frontend/ (React App)
    │   ├── src/components/
    │   ├── src/pages/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.html
    ├── backend/
    │   ├── main.py
    │   ├── gmail_api.py
    |   ├── config.py
    │   └── requirements.txt
    ├──Google-config.tsx
    └── README.md

⚙️ Setup Instructions

1. Clone the Repository

        git clone https://github.com/AdityaHada1510/AI-Email-Assistant-React-Python.git
        cd AI-Email-Assistant-React-Python

2. Backend Setup (Python)

        cd backend
        python -m venv .virtual
        source .virtual/bin/activate  # Windows: .virtual\Scripts\activate
        pip install -r requirements.txt

3. Frontend Setup (React + Vite)

        cd ../frontend
        npm install
        npm run dev

4. Run Backend Server

        cd ../backend
        uvicorn main:app --reload --port 8000

🔐 Important Notes

🚫 Sensitive Files NOT Included:

    credentials.json  → For Google API Client Secrets.
    
    token.pickle      → Your Gmail API token (Generated after auth).
    
    config.py         → For storing GROQ_API_KEY securely.
    
    Google Client ID (Frontend OAuth) Google-config.tsx → Must be configured in Google Cloud Console.

📝 How to Get These Files:

GROQ API Key:

    Sign up at Groq Cloud and get your API key.
    
    Add it to your config.py file:
    
    GROQ_API_KEY=your-groq-api-key

Google API Credentials (OAuth 2.0):

    Visit Google Cloud Console
    
    Create a new project.
    
    Enable Gmail API.
    
    Create OAuth Client ID (Web App).
    
    Download credentials.json.

token.pickle (First-Time Authorization):

    Run uvicorn main:app --reload --port 8000
    
    Visit http://localhost:8000/authorize in your browser.
    
    Authorize Gmail API.
    
    This will generate a token.pickle file.

Google Client ID (Frontend Login):

    Use the same OAuth credentials.
    
    Paste the Client ID in your Google-congig.tsx GoogleOAuthProvider.

✅ Ready Commands

    Start Frontend (React) → npm run dev
    
    Start Backend (FastAPI) → uvicorn main:app --reload --port 8000

📸 Screenshots

  <img width="1241" height="678" alt="1" src="https://github.com/user-attachments/assets/ee278959-b243-4e16-9f2d-ee84731d9978" />
  <img width="1244" height="682" alt="2" src="https://github.com/user-attachments/assets/c105e2ed-c6e7-47f5-8924-8c3bb24c7c41" />
  <img width="1241" height="685" alt="3" src="https://github.com/user-attachments/assets/0bb99706-6754-44b8-9812-29ea468ab941" />
  <img width="1243" height="685" alt="4" src="https://github.com/user-attachments/assets/8bd4c77c-df94-41f5-b847-a478634d69bb" />
  <img width="1244" height="682" alt="5" src="https://github.com/user-attachments/assets/0a10fb7a-45aa-429a-82cb-3f83130fbd45" />
  <img width="1242" height="683" alt="6" src="https://github.com/user-attachments/assets/6cee80b2-92f8-4a71-99fb-3a5afa7523f2" />


📌 Credits

Built by Aditya Hada with ❤️ using FastAPI, React & Groq.
