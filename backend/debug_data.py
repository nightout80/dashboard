import data_loader
import pandas as pd

SPREADSHEET_ID = "1EojVFfYMHJa0knFLdCQreisLbt6SwkNK3T405K47GwE"

def debug_headers():
    print("--- Debugging Google Sheet Headers ---")
    
    creds = data_loader.get_google_creds()
    if not creds:
        print("Creds invalid")
        return
        
    try:
        from googleapiclient.discovery import build
        service = build("sheets", "v4", credentials=creds)
        
        print("\nListing ALL Sheet Titles:")
        spreadsheet = service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID).execute()
        sheets = spreadsheet.get('sheets', [])
        for s in sheets:
            print(f"- {s['properties']['title']}")
            
    except Exception as e:
        print(f"Error listing sheets: {e}")

    # Check RHR Sheet - Try to get everything
    print("\nFetching 'RHR' content (first 5 rows)...")
    try:
        result = service.spreadsheets().values().get(spreadsheetId=SPREADSHEET_ID, range="RHR!A1:Z5").execute()
        values = result.get("values", [])
        if values:
            print(f"Found {len(values)} rows.")
            print("Row 1 (Headers?):", values[0])
            print("Row 2 (Data?):", values[1] if len(values) > 1 else "None")
        else:
            print("RHR returned NO values for A1:Z5.")
    except Exception as e:
        print(f"Error fetching RHR: {e}")

    # Check TSS Sheet
    print("\nFetching 'TSS' content (first 5 rows)...")
    try:
        result = service.spreadsheets().values().get(spreadsheetId=SPREADSHEET_ID, range="TSS!A1:Z5").execute()
        values = result.get("values", [])
        if values:
            print(f"Found {len(values)} rows.")
            print("Row 1 (Headers?):", values[0])
            print("Row 2 (Data?):", values[1] if len(values) > 1 else "None")
        else:
            print("TSS returned NO values for A1:Z5.")
    except Exception as e:
        print(f"Error fetching TSS: {e}")

    # Check Garmin2 Sheet Extended
    print("\nFetching 'Garmin2' Extended content (A1:AZ5)...")
    try:
        result = service.spreadsheets().values().get(spreadsheetId=SPREADSHEET_ID, range="Garmin2!A1:AZ5").execute()
        values = result.get("values", [])
        if values:
            print("Garmin2 Headers (A1:AZ1):", values[0])
    except Exception as e:
        print(f"Error fetching Garmin2 Extended: {e}")

    print("\n--- Inspecting Plan CSV Headers ---")
    df_plan = data_loader.load_plan_data()
    if not df_plan.empty:
        print(f"Plan Columns: {list(df_plan.columns)}")
    else:
        print("Plan CSV is empty.")

if __name__ == "__main__":
    debug_headers()
