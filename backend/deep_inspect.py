import logic
import data_loader
import pandas as pd

def deep_inspect():
    spreadsheet_id = logic.SPREADSHEET_ID
    
    # Garmin2 full columns
    print("--- Garmin2 Full Columns ---")
    df_g2 = data_loader.load_sheet_data(spreadsheet_id, "Garmin2!A:AZ")
    if not df_g2.empty:
        print(df_g2.columns.tolist())
        # Check if Pace_Raw exists
        if "Pace_Raw" in df_g2.columns:
            print("FOUND Pace_Raw in Garmin2")
        else:
            # Maybe it's a hidden column or my range is too small?
            # A:AZ should cover 52 columns.
            pass
            
    # All_Workouts full columns
    print("\n--- All_Workouts Full Columns ---")
    df_aw = data_loader.load_sheet_data(spreadsheet_id, "All_Workouts!A:AZ")
    if not df_aw.empty:
        print(df_aw.columns.tolist())
    
    # Search for "Tageplan" or "Gelaufen" in EVERYTHING
    for name, df in [("Garmin2", df_g2), ("All_Workouts", df_aw)]:
        if df.empty: continue
        print(f"\nSearching for 'Tageplan' or 'Gelaufen' in {name}...")
        for col in df.columns:
            matches = df[df[col].astype(str).str.contains('Tageplan|Gelaufen', case=False, na=False)]
            if not matches.empty:
                print(f"  FOUND in column '{col}': {matches[col].unique().tolist()}")

if __name__ == "__main__":
    deep_inspect()
