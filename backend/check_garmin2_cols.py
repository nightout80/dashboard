import logic
import data_loader

def check_garmin2_cols():
    spreadsheet_id = logic.SPREADSHEET_ID
    df = data_loader.load_sheet_data(spreadsheet_id, "Garmin2!A:ZZ")
    if not df.empty:
        cols = df.columns.tolist()
        print(f"Total Columns found: {len(cols)}")
        for i in range(0, len(cols), 10):
            print(f"Cols {i}-{i+10}: {cols[i:i+10]}")
        
        if "Pace_Raw" in cols:
            print("\n!!! FOUND Pace_Raw !!!")
        if "Avg HR" in cols:
            print("\n!!! FOUND Avg HR !!!")
    else:
        print("Garmin2 is empty.")

if __name__ == "__main__":
    check_garmin2_cols()
