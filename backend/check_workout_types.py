import logic
import data_loader

def check_workout_types():
    spreadsheet_id = logic.SPREADSHEET_ID
    df = data_loader.load_sheet_data(spreadsheet_id, "Workout_Types!A:Z")
    if not df.empty:
        print(f"Columns: {df.columns.tolist()}")
        print(df.head(20))
    else:
        print("Workout_Types is empty.")

if __name__ == "__main__":
    check_workout_types()
