import logic
import data_loader
import pandas as pd

def find_metrics():
    spreadsheet_id = logic.SPREADSHEET_ID
    
    sheets_to_check = ["Garmin2", "Garmin", "All_Workouts", "Boxplot"]
    
    for sheet in sheets_to_check:
        print(f"\n--- Checking Sheet: {sheet} ---")
        df = data_loader.load_sheet_data(spreadsheet_id, f"'{sheet}'!A1:AZ20")
        if not df.empty:
            print(f"Columns: {df.columns.tolist()[:10]}... (total {len(df.columns)})")
            # Search for metrics in columns
            cols = [str(c).lower() for c in df.columns]
            if any("pace" in c for c in cols) or any("hr" in c for c in cols) or any("heart" in c for c in cols):
                print(f"FOUND metrics-like columns in {sheet}: {[c for c in df.columns if 'pace' in c.lower() or 'hr' in c.lower() or 'heart' in c.lower()]}")
            
            # Search for "Tageplan" or "Gelaufen" in data
            mask = df.apply(lambda x: x.astype(str).str.contains('Tageplan|Gelaufen', case=False)).any(axis=1)
            if mask.any():
                print(f"FOUND 'Tageplan' or 'Gelaufen' in rows of {sheet}")
        else:
            print(f"Sheet {sheet} is empty or not found.")

if __name__ == "__main__":
    find_metrics()
