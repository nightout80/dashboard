import logic
import data_loader
import pandas as pd

def inspect_metrics():
    spreadsheet_id = logic.SPREADSHEET_ID
    df_g2 = data_loader.load_sheet_data(spreadsheet_id, "Garmin2!A:ZZ")
    if not df_g2.empty:
        print(f"Pace_Raw sample: {df_g2['Pace_Raw'].head(10).tolist()}")
        print(f"Pace_Raw types: {df_g2['Pace_Raw'].apply(type).unique().tolist()}")
        print(f"Avg HR sample: {df_g2['Avg HR'].head(10).tolist()}")
        print(f"Avg HR types: {df_g2['Avg HR'].apply(type).unique().tolist()}")
    else:
        print("Garmin2 is empty.")

if __name__ == "__main__":
    inspect_metrics()
