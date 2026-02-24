import logic
import data_loader
import pandas as pd

def check_uniques():
    spreadsheet_id = logic.SPREADSHEET_ID
    df = data_loader.load_sheet_data(spreadsheet_id, "All_Workouts!A:AZ")
    if not df.empty:
        cols_to_check = ['type', 'display_type', 'activity_type_display_name', 'workout_type']
        for col in cols_to_check:
            if col in df.columns:
                print(f"\n--- Unique values in '{col}' ---")
                print(df[col].unique().tolist())
    else:
        print("All_Workouts is empty.")

if __name__ == "__main__":
    check_uniques()
