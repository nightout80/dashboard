import logic
import data_loader
import pandas as pd

def thorough_sample():
    spreadsheet_id = logic.SPREADSHEET_ID
    
    # Garmin2 Sample
    print("--- Garmin2 Sample (20 rows) ---")
    df_g2 = data_loader.load_sheet_data(spreadsheet_id, "Garmin2!A1:AZ20")
    if not df_g2.empty:
        # Columns of interest based on my previous discovery
        cols = ['ID', 'Type', 'start_date', 'Title', 'Distance', 'Avg HR', 'Avg Pace', 'Pace_Raw']
        cols = [c for c in cols if c in df_g2.columns]
        print(df_g2[cols].head(20))
        
    # All_Workouts Sample
    print("\n--- All_Workouts Sample (20 rows) ---")
    df_aw = data_loader.load_sheet_data(spreadsheet_id, "All_Workouts!A1:AZ20")
    if not df_aw.empty:
        cols = ['id', 'name', 'type', 'activity_type_display_name', 'workout_type']
        cols = [c for c in cols if c in df_aw.columns]
        print(df_aw[cols].head(20))

if __name__ == "__main__":
    thorough_sample()
