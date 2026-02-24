import logic
import data_loader
from googleapiclient.discovery import build

def list_sheets():
    spreadsheet_id = logic.SPREADSHEET_ID
    creds = data_loader.get_google_creds()
    if not creds:
        print("No valid credentials found.")
        return

    try:
        service = build("sheets", "v4", credentials=creds)
        spreadsheet = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
        sheets = spreadsheet.get('sheets', [])
        print("Available Sheets:")
        for sheet in sheets:
            print(f"- {sheet.get('properties', {}).get('title')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_sheets()
