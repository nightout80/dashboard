import logic
import data_loader

def debug_data_sample():
    spreadsheet_id = logic.SPREADSHEET_ID
    
    # Sample Garmin2
    print("--- Garmin2 Sample ---")
    df_g2 = data_loader.load_sheet_data(spreadsheet_id, "Garmin2!A:AZ")
    if not df_g2.empty:
        print(f"Columns: {df_g2.columns.tolist()}")
        print(df_g2.head())
    else:
        print("Garmin2 is empty or could not be loaded.")
    
    # Sample All_Workouts
    print("\n--- All_Workouts Sample ---")
    df_aw = data_loader.load_sheet_data(spreadsheet_id, "All_Workouts!A:AZ")
    if not df_aw.empty:
        print(f"Columns: {df_aw.columns.tolist()}")
        print(df_aw.head())
    else:
        print("All_Workouts is empty or could not be loaded.")

if __name__ == "__main__":
    debug_data_sample()
