import logic
import data_loader
import pandas as pd

def debug_sheets():
    spreadsheet_id = logic.SPREADSHEET_ID
    
    print("Fetching Garmin2 columns...")
    garmin2_df = data_loader.load_sheet_data(spreadsheet_id, "Garmin2!A1:AZ1")
    print(f"Garmin2 Columns: {garmin2_df.columns.tolist()}")
    
    print("\nFetching all workouts columns...")
    # Trying different possible range if first fails
    try:
        all_workouts_df = data_loader.load_sheet_data(spreadsheet_id, "'all workouts'!A1:AZ1")
        print(f"all workouts Columns: {all_workouts_df.columns.tolist()}")
    except Exception as e:
        print(f"Could not load 'all workouts': {e}")

if __name__ == "__main__":
    debug_sheets()
