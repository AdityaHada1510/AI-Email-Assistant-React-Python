from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List
import json
import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from config import GROQ_API_KEY
from openai import OpenAI
from datetime import datetime
from gmail_api import get_gmail_service
from fastapi import Body


app = FastAPI()

SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

client = OpenAI( 
    base_url="https://api.groq.com/openai/v1",
    api_key=GROQ_API_KEY,
    )

class Email(BaseModel):
    subject: str
    from_: str = Field(..., alias="from")
    snippet: str

class SmartSearchRequest(BaseModel):
    query: str
    emails: List[Email]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # React origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_snippet(snippet: str) -> str:
    # Remove non-ASCII (invisible Unicode junk), strip whitespace
    return snippet.encode('ascii', 'ignore').decode().strip()



# Endpoint for smart search
@app.post("/smart-search")
def smart_search(request: SmartSearchRequest):
    prompt = f"""
You are an AI email assistant.

The user wants to search their inbox using this natural language query:
"{request.query}"

You are given a list of emails. Each email has:
- subject
- from
- snippet (content preview)

Return ONLY the relevant emails that match the query. Respond ONLY with JSON in this format:

[
  {{ "subject": "...", "from": "...", "snippet": "..." }},
  ...
]
Emails:
{json.dumps([{
    "subject": e.subject,
    "from": e.from_,
    "snippet": clean_snippet(e.snippet) 
} for e in request.emails])}
"""
    
    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",  # or "gpt-4"
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        raw = response.choices[0].message.content
        print("🧠 GPT raw response:", raw)

        start = raw.find("[")
        end = raw.rfind("]") + 1
        json_part = raw[start:end]
        return JSONResponse(content=json.loads(json_part))  # ✅ only this, not eval
    except Exception as e:
        print("❌ Smart Search Exception:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})
    



# Endpoint to authorize user with Google
@app.get("/authorize")
def authorize():
    flow = InstalledAppFlow.from_client_secrets_file(
        'credentials.json', SCOPES)
    creds = flow.run_local_server(port=8085)
    with open('token.pickle', 'wb') as token:
        pickle.dump(creds, token)
    return {"message": "Authorization successful"}


# Classify email using Groq
def classify_email_with_groq(subject: str, snippet: str):
    prompt = f"""
Classify the following email into:
- urgency: high / medium / low
- sentiment: positive / negative / neutral
- category: promotions / social / updates / inbox / finance / hr / spam

Email:
Subject: {subject}
Snippet: {snippet}

Respond ONLY with JSON in this format:
{{
  "urgency": "...",
  "sentiment": "...",
  "category": "..."
}}
    """
    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        content = response.choices[0].message.content
        print("🧠 Classification:", content)
        return json.loads(content)
    except Exception as e:
        print("❌ Classification error:", e)
        return {
            "urgency": "medium",
            "sentiment": "neutral",
            "category": "inbox"
        }
    



# Endpoint to get emails
@app.get("/emails")
def get_emails():
    if not os.path.exists('token.pickle'):
        return JSONResponse({"error": "User not authenticated"}, status_code=401)

    with open('token.pickle', 'rb') as token:
        creds = pickle.load(token)

    service = build('gmail', 'v1', credentials=creds)
    results = service.users().messages().list(userId='me', maxResults=10).execute()
    messages = results.get('messages', [])

    emails = []
    for msg in messages:
        
        msg_data = service.users().messages().get(userId='me', id=msg['id']).execute()
        headers = msg_data.get("payload", {}).get("headers", [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(No Subject)')
        sender = next((h['value'] for h in headers if h['name'] == 'From'), '(No Sender)')
        snippet = msg_data.get("snippet", '')

        # Get internalDate (milliseconds since epoch), then format
        internal_date = msg_data.get("internalDate")
        if internal_date:
            date = datetime.fromtimestamp(int(internal_date) / 1000).strftime("%Y-%m-%d %H:%M:%S")
        else:
            date = "(Unknown)"

        # Classify email using Groq
        classification = classify_email_with_groq(subject, snippet)

        labels = msg_data.get("labelIds", [])
        is_starred = "STARRED" in labels

        emails.append({
            "id": msg['id'],
            "subject": subject, 
            "from": sender, 
            "snippet": snippet ,
            "date": date , 
            **classification ,
            "is_starred": is_starred})

    return emails





class SummaryRequest(BaseModel):
    subject: str
    from_: str
    snippet: str

# Endpoint to summarize an email
@app.post("/summarize")
def summarize_email(request: SummaryRequest):
    prompt = f"""
You are an AI email assistant. Summarize the following email:

Subject: {request.subject}
From: {request.from_}
Content: {request.snippet}

Reply with only the summary.
    """
    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
        )
        return {"summary": response.choices[0].message.content.strip()}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    

class EmailRequest(BaseModel):
    subject: str
    from_: str
    snippet: str

#Endpoint to generate a reply
@app.post("/generate-reply")
def generate_reply(data: EmailRequest):
    prompt = f"""
You are an AI email assistant. Write a concise and professional reply.

From: {data.from_}
Subject: {data.subject}
Email Snippet: {data.snippet}

Reply:
"""
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6,
    )
    return {"reply": response.choices[0].message.content.strip()}



def get_gmail_service():
    if not os.path.exists('token.pickle'):
        raise Exception("User not authenticated")

    with open('token.pickle', 'rb') as token:
        creds = pickle.load(token)

    return build('gmail', 'v1', credentials=creds)



@app.post("/toggle-read")
async def toggle_read(message_id: str = Body(...), mark_as_read: bool = Body(...)):
    try:
        service = get_gmail_service()
        if mark_as_read:
            # Remove "UNREAD" label → mark as read
            service.users().messages().modify(
                userId='me',
                id=message_id,
                body={"removeLabelIds": ["UNREAD"]}
            ).execute()
        else:
            # Add "UNREAD" label → mark as unread
            service.users().messages().modify(
                userId='me',
                id=message_id,
                body={"addLabelIds": ["UNREAD"]}
            ).execute()
        return {"status": "success", "message_id": message_id, "is_now_read": mark_as_read}
    except Exception as e:
        print("❌ Failed to toggle read status:", e)
        raise HTTPException(status_code=500, detail="Failed to update read/unread status.")

