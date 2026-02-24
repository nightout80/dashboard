import logic
import data_loader
import pandas as pd
from googleapiclient.discovery import build

def search_everywhere():
    spreadsheet_id = logic.SPREADSHEET_ID
    creds = data_loader.get_google_creds()
    service = build("sheets", "v4", credentials=creds)
    spreadsheet = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
    sheets = [s.get('properties', {}).get('title') for s in spreadsheet.get('sheets', [])]
    
    for sheet in sheets:
        print(f"\n--- Searching in {sheet} ---")
        try:
            df = data_loader.load_sheet_data(spreadsheet_id, f"'{sheet}'!A1:AZ50")
            if df.empty: continue
            
            mask = df.apply(lambda x: x.astype(str).str.contains('Tageplan|Gelaufen', case=False, na=False)).any(axis=1)
            if mask.any():
                print(f"  MATCH FOUND in {sheet}!")
                # Print rows with matches
                print(df[mask].head())
        except Exception as e:
            print(f"  Error reading {sheet}: {e}")

if __name__ == "__main__":
    search_everywhere()
