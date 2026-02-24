import logic
import data_loader
import pandas as pd
import numpy as np
from datetime import datetime

def prototype_boxplot():
    spreadsheet_id = logic.SPREADSHEET_ID
    
    print("Loading data...")
    # Using larger range for Garmin2 to ensure all columns
    df_g2 = data_loader.load_sheet_data(spreadsheet_id, "Garmin2!A:ZZ")
    df_aw = data_loader.load_sheet_data(spreadsheet_id, "All_Workouts!A:AZ")
    
    if df_g2.empty or df_aw.empty:
        print("Data loading failed.")
        return

    print(f"Garmin2 rows: {len(df_g2)}, All_Workouts rows: {len(df_aw)}")
    
    # Merge
    # all_workouts.id == Garmin2.Strava_id
    # Ensure they are strings for matching
    df_aw['id'] = df_aw['id'].astype(str)
    df_g2['Strava_id'] = df_g2['Strava_id'].astype(str)
    
    merged = pd.merge(df_g2, df_aw, left_on='Strava_id', right_on='id', how='inner', suffixes=('', '_aw'))
    print(f"Merged rows: {len(merged)}")
    
    if merged.empty:
        # Maybe IDs don't match exactly? Try to strip or clean
        df_aw['id'] = df_aw['id'].str.strip()
        df_g2['Strava_id'] = df_g2['Strava_id'].str.strip()
        merged = pd.merge(df_g2, df_aw, left_on='Strava_id', right_on='id', how='inner', suffixes=('', '_aw'))
        print(f"Merged rows after strip: {len(merged)}")

    # Clean metrics
    def clean_hr(val):
        try:
            return float(str(val).replace(',', '.'))
        except:
            return np.nan

    def pace_to_seconds(val):
        # Pace is likely "MM:SS"
        if not val or not isinstance(val, str) or ':' not in val:
            return np.nan
        try:
            parts = val.split(':')
            if len(parts) == 2:
                return int(parts[0]) * 60 + int(parts[1])
            return np.nan
        except:
            return np.nan

    merged['HR_Numeric'] = merged['Avg HR'].apply(clean_hr)
    merged['Pace_Seconds'] = merged['Pace_Raw'].apply(pace_to_seconds)

    # Filter for "Lauf" or "Run"
    runs = merged[merged['type'].str.contains('Run|Lauf|Laufen|Traillauf', case=False, na=False)].copy()
    print(f"Run activities: {len(runs)}")

    # Group by Week
    runs['start_date_parsed'] = pd.to_datetime(runs['start_date'], dayfirst=True, errors='coerce')
    runs['Week'] = runs['start_date_parsed'].dt.isocalendar().week
    
    # Calculate stats for HR
    stats = runs.groupby('Week')['HR_Numeric'].agg(['min', 'count']).reset_index()
    # Pandas quantile
    def get_boxplot_stats(group, col):
        q1 = group[col].quantile(0.25)
        median = group[col].quantile(0.5)
        q3 = group[col].quantile(0.75)
        mi = group[col].min()
        ma = group[col].max()
        return pd.Series({'min': mi, 'q1': q1, 'median': median, 'q3': q3, 'max': ma, 'count': len(group)})

    boxplot_hr = runs.groupby('Week').apply(lambda x: get_boxplot_stats(x, 'HR_Numeric')).reset_index()
    print("\n--- Boxplot Stats for HR by Week ---")
    print(boxplot_hr.head())

    boxplot_pace = runs.groupby('Week').apply(lambda x: get_boxplot_stats(x, 'Pace_Seconds')).reset_index()
    print("\n--- Boxplot Stats for Pace by Week ---")
    print(boxplot_pace.head())

if __name__ == "__main__":
    prototype_boxplot()
