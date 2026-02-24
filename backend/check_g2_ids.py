import logic
import data_loader

def check_g2_cols():
    spreadsheet_id = logic.SPREADSHEET_ID
    # Fetch a large range to be sure
    df = data_loader.load_sheet_data(spreadsheet_id, "Garmin2!A:ZZ")
    if not df.empty:
        print(f"Total columns: {len(df.columns)}")
        print(f"Columns: {df.columns.tolist()}")
        # Check for case sensitivity or slight variations
        ids = [c for c in df.columns if 'id' in c.lower() or 'strava' in c.lower()]
        print(f"Potential ID columns: {ids}")
    else:
        print("Garmin2 is empty.")

if __name__ == "__main__":
    check_g2_cols()
