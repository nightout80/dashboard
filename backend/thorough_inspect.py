import logic
import data_loader
import pandas as pd

def thorough_inspect():
    spreadsheet_id = logic.SPREADSHEET_ID
    
    # Garmin2 - fetch up to ZZ
    print("--- Garmin2 Full Columns (A:ZZ) ---")
    df_g2_large = data_loader.load_sheet_data(spreadsheet_id, "Garmin2!A1:ZZ1")
    if not df_g2_large.empty:
        print(f"Total Columns: {len(df_g2_large.columns)}")
        print(df_g2_large.columns.tolist())
        if "Pace_Raw" in df_g2_large.columns:
            print("FOUND Pace_Raw in Garmin2")
        if "Avg HR" in df_g2_large.columns:
            print("FOUND Avg HR in Garmin2")
            
    # All_Workouts - sample rows to look for indicators
    print("\n--- All_Workouts Sample (20 rows) ---")
    df_aw = data_loader.load_sheet_data(spreadsheet_id, "All_Workouts!A1:AZ20")
    if not df_aw.empty:
        # Check for any column that might distinguish Planned vs Actual
        cols_to_print = ['id', 'name', 'type', 'activity_type_display_name', 'workout_type', 'display_type']
        cols_to_print = [c for c in cols_to_print if c in df_aw.columns]
        print(df_aw[cols_to_print].head(20))

if __name__ == "__main__":
    thorough_inspect()
