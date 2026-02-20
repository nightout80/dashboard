from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
import os.path
import json

# Scopes
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = "1EojVFfYMHJa0knFLdCQreisLbt6SwkNK3T405K47GwE" 

def main():
    token_path = 'google_tokens.json'
    if not os.path.exists(token_path):
        # try parent dir
        token_path = os.path.join(os.path.dirname(__file__), '..', 'google_tokens.json')

    print(f"Using token path: {token_path}")
    
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(token_path, 'w') as token:
                token.write(creds.to_json())

    service = build('sheets', 'v4', credentials=creds)

    print("\n--- PEEKING AT 'Endurance' SHEET (A1:Z5) ---")
    try:
        result = service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID, range="Endurance!A1:Z5").execute()
        rows = result.get('values', [])
        for row in rows:
            print(row)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
