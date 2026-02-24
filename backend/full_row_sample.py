import logic
import data_loader
import pandas as pd

def full_row_sample():
    spreadsheet_id = logic.SPREADSHEET_ID
    df = data_loader.load_sheet_data(spreadsheet_id, "All_Workouts!A:AZ")
    if not df.empty:
        print(f"Columns: {df.columns.tolist()}")
        print("\n--- Row 0 ---")
        print(df.iloc[0].to_dict())
        print("\n--- Row 1 ---")
        print(df.iloc[1].to_dict())
    else:
        print("All_Workouts is empty.")

if __name__ == "__main__":
    full_row_sample()
