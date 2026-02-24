import logic
import data_loader

def debug_columns_v4():
    spreadsheet_id = logic.SPREADSHEET_ID
    
    # Check Garmin2
    print("--- Garmin2 Columns ---")
    df_g2 = data_loader.load_sheet_data(spreadsheet_id, "Garmin2!A1:AZ1")
    print(df_g2.columns.tolist())
    
    # Check All_Workouts
    print("\n--- All_Workouts Columns ---")
    df_aw = data_loader.load_sheet_data(spreadsheet_id, "All_Workouts!A1:AZ1")
    print(df_aw.columns.tolist())

if __name__ == "__main__":
    debug_columns_v4()
