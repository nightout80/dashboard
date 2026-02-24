import logic
import data_loader
import pandas as pd

def count_types():
    spreadsheet_id = logic.SPREADSHEET_ID
    df = data_loader.load_sheet_data(spreadsheet_id, "All_Workouts!A:AZ")
    if not df.empty:
        print("--- Workout Type Counts in All_Workouts ---")
        print(df['workout_type'].value_counts())
        
        print("\n--- Activity Type Display Name Counts ---")
        print(df['activity_type_display_name'].value_counts().head(20))
        
        # Check if Garmin2 has the same IDs
        df_g2 = data_loader.load_sheet_data(spreadsheet_id, "Garmin2!A:AZ")
        if not df_g2.empty:
             print("\n--- Rows in Garmin2 ---")
             print(len(df_g2))
    else:
        print("All_Workouts is empty.")

if __name__ == "__main__":
    count_types()
