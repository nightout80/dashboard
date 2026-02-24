import logic
import data_loader
import pandas as pd

def debug_columns():
    spreadsheet_id = logic.SPREADSHEET_ID
    
    print("Fetching All_Workouts columns...")
    try:
        df = data_loader.load_sheet_data(spreadsheet_id, "All_Workouts!A1:AZ1")
        print(f"All_Workouts Columns: {df.columns.tolist()}")
    except Exception as e:
        print(f"Error: {e}")
        
    print("\nFetching Boxplot columns...")
    try:
        df = data_loader.load_sheet_data(spreadsheet_id, "Boxplot!A1:AZ1")
        print(f"Boxplot Columns: {df.columns.tolist()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_columns()
