import logic
import data_loader

def debug_columns_v3():
    spreadsheet_id = logic.SPREADSHEET_ID
    
    for sheet in ["Garmin2", "All_Workouts"]:
        print(f"--- {sheet} Columns ---")
        df = data_loader.load_sheet_data(spreadsheet_id, f"{sheet}!A1:AZ1")
        print(df.columns.tolist())
        print("\n")

if __name__ == "__main__":
    debug_columns_v3()
