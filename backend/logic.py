import pandas as pd
import numpy as np
import re
from datetime import datetime, timedelta
import data_loader

# Configuration
# TODO: User to provide the correct Spreadsheet ID
SPREADSHEET_ID = "1EojVFfYMHJa0knFLdCQreisLbt6SwkNK3T405K47GwE" 

def get_dashboard_data():
    """
    Main function to gather and process all data for the dashboard.
    """
    
    # 1. Load Data
    plan_df = data_loader.load_plan_data()
    
    # Load Google Sheets with all columns
    activities_df = data_loader.load_sheet_data(SPREADSHEET_ID, "Garmin2!A:AZ")
    vitals_df = data_loader.load_sheet_data(SPREADSHEET_ID, "RHR!A:Z")
    endurance_df = data_loader.load_sheet_data(SPREADSHEET_ID, "Endurance!A:E")
    
    # 2. Process Data
    today = datetime.now().date()
    
    # --- Endurance Processing ---
    endurance_data = {}
    if not endurance_df.empty:
        # Expected columns: Date, Endurance Score, Classification (Num), Classification (Label), Feedback (Code)
        endurance_df['Date_Parsed'] = pd.to_datetime(endurance_df['Date'], format='%d.%m.%Y', errors='coerce')
        
        # Get today's or most recent endurance data
        today_endurance = endurance_df[endurance_df['Date_Parsed'].dt.date == today]
        
        if today_endurance.empty:
            # Get most recent if today not available
            endurance_df_sorted = endurance_df.sort_values('Date_Parsed', ascending=False)
            if not endurance_df_sorted.empty:
                latest = endurance_df_sorted.iloc[0]
                endurance_data = {
                    "score": int(latest.get('Endurance Score', 0)) if pd.notnull(latest.get('Endurance Score')) else 0,
                    "classification": str(latest.get('Classification (Label)', 'Unknown')),
                    "classification_num": int(latest.get('Classification (Num)', 0)) if pd.notnull(latest.get('Classification (Num)')) else 0
                }
        else:
            latest = today_endurance.iloc[0]
            endurance_data = {
                "score": int(latest.get('Endurance Score', 0)) if pd.notnull(latest.get('Endurance Score')) else 0,
                "classification": str(latest.get('Classification (Label)', 'Unknown')),
                "classification_num": int(latest.get('Classification (Num)', 0)) if pd.notnull(latest.get('Classification (Num)')) else 0
            }

    # --- HRV History Processing ---
    hrv_history = []
    if not vitals_df.empty:
         vitals_df.columns = [c.strip() for c in vitals_df.columns]
         if 'Date' in vitals_df.columns and 'HRV Status' in vitals_df.columns:
            vitals_df['Date_Parsed'] = pd.to_datetime(vitals_df['Date'], format='%d.%m.%Y', errors='coerce')
            
            # Sort by date
            vitals_df = vitals_df.sort_values('Date_Parsed')
            
            # Filter last 90 days
            cutoff_date = pd.Timestamp(today - timedelta(days=90))
            recent_vitals = vitals_df[vitals_df['Date_Parsed'] >= cutoff_date].copy()
            
            # Calculate 30-day rolling average for HRV
            # We need numeric HRV
            recent_vitals['HRV_Num'] = pd.to_numeric(recent_vitals['HRV Status'], errors='coerce')
            recent_vitals['HRV_30d_Avg'] = recent_vitals['HRV_Num'].rolling(window=30, min_periods=1).mean()
            
            for _, row in recent_vitals.iterrows():
                if pd.notnull(row['Date_Parsed']) and pd.notnull(row['HRV_Num']):
                    hrv_history.append({
                        "date": row['Date_Parsed'].strftime('%d.%m'),
                        "hrv": row['HRV_Num'],
                        "baseline": row['HRV_30d_Avg'] if pd.notnull(row['HRV_30d_Avg']) else row['HRV_Num']
                    })
    
    # --- Vitals Processing ---
    latest_vitals = {}
    if not vitals_df.empty:
        # standardizing columns
        vitals_df.columns = [c.strip() for c in vitals_df.columns]
        
        # Parse Date: Expecting '1.1.2024' -> %d.%m.%Y
        if 'Date' in vitals_df.columns:
            vitals_df['Date_Parsed'] = pd.to_datetime(vitals_df['Date'], format='%d.%m.%Y', errors='coerce')
            
            # Find row for TODAY
            today_row = vitals_df[vitals_df['Date_Parsed'].dt.date == today]
            
            if not today_row.empty:
                last_row = today_row.iloc[0] # Take the first match for today
                
                # Parse Sleep Duration "6h 54min"
                sleep_hrs = 0
                dur_str = str(last_row.get("Duration", ""))
                try:
                    if 'h' in dur_str and 'min' in dur_str:
                        parts = dur_str.replace('min', '').split('h')
                        sleep_hrs = float(parts[0]) + float(parts[1])/60.0
                    elif 'h' in dur_str:
                         sleep_hrs = float(dur_str.replace('h', ''))
                except:
                    pass

                # Handle numeric parsing safely
                def safe_float(val):
                    try:
                        return float(str(val).replace(',', '.'))
                    except:
                        return 0.0

                latest_vitals = {
                    "hrv": {
                        "value": safe_float(last_row.get("HRV Status", 0)),
                        "avg_7d": 0,
                        "change": 0
                    },
                    "rhr": {
                        "value": safe_float(last_row.get("Resting Heart Rate", 0)),
                        "avg_7d": 0,
                        "change": 0
                    },
                    "sleep_score": {
                        "value": safe_float(last_row.get("Score", 0)),
                        "avg_7d": 0,
                        "change": 0
                    },
                    "sleep_hours": round(sleep_hrs, 1),
                    "recovery_score": calculate_recovery(last_row) 
                }

                # Calculate Averages and Changes if history exists
                # We need the last 7 days excluding today for average? Or including?
                # Whoop typically compares Today vs 30-day average. 
                # User asked for "Last 7 days average"
                
                # Get last 7 days data
                history_mask = (vitals_df['Date_Parsed'].dt.date >= today - timedelta(days=7)) & (vitals_df['Date_Parsed'].dt.date <= today)
                history_df = vitals_df.loc[history_mask]
                
                if not history_df.empty:
                    # Calculate 7d Avg (excluding today if possible, or just all available in window)
                    # Let's use all available in the 7d window for stability
                    latest_vitals['hrv']['avg_7d'] = round(history_df['HRV Status'].apply(safe_float).mean(), 1)
                    latest_vitals['rhr']['avg_7d'] = round(history_df['Resting Heart Rate'].apply(safe_float).mean(), 1)
                    latest_vitals['sleep_score']['avg_7d'] = round(history_df['Score'].apply(safe_float).mean(), 1)

                    # Calculate Change vs Yesterday
                    # Find yesterday's row
                    yesterday_row = vitals_df[vitals_df['Date_Parsed'].dt.date == today - timedelta(days=1)]
                    if not yesterday_row.empty:
                        y_row = yesterday_row.iloc[0]
                        
                        def calc_pct_change(current, old):
                            if old == 0: return 0
                            return round(((current - old) / old) * 100, 1)

                        latest_vitals['hrv']['change'] = calc_pct_change(latest_vitals['hrv']['value'], safe_float(y_row.get("HRV Status", 0)))
                        latest_vitals['rhr']['change'] = calc_pct_change(latest_vitals['rhr']['value'], safe_float(y_row.get("Resting Heart Rate", 0)))
                        latest_vitals['sleep_score']['change'] = calc_pct_change(latest_vitals['sleep_score']['value'], safe_float(y_row.get("Score", 0)))
    
    # --- Load Processing ---
    today_strain = 0
    load_7d = 0
    
    if not activities_df.empty:
        activities_df.columns = [c.strip() for c in activities_df.columns]
        
        # Map start_date to Date
        if 'start_date' in activities_df.columns:
            activities_df['Date_Parsed'] = pd.to_datetime(activities_df['start_date'], format='%d.%m.%Y', errors='coerce')
        
        # Find TSS column (it has a special char at the end)
        tss_col = next((c for c in activities_df.columns if "Training Stress Score" in c), None)
        
        if tss_col and 'Date_Parsed' in activities_df.columns:
            # Clean TSS values
            activities_df['TSS_Clean'] = activities_df[tss_col].astype(str).str.replace(',', '.', regex=False)
            activities_df['TSS_Clean'] = pd.to_numeric(activities_df['TSS_Clean'], errors='coerce').fillna(0)
            
            # Strain for today
            today_activities = activities_df[activities_df['Date_Parsed'].dt.date == today]
            today_strain = today_activities['TSS_Clean'].sum() 
            
            # Load trends (previous 7 days)
            # Include today + last 6 days for "Last 7 days" view
            # Or just last 7 days history
            mask_7d = (activities_df['Date_Parsed'].dt.date >= today - timedelta(days=20)) & (activities_df['Date_Parsed'].dt.date <= today)
            # We want specific dataframe for list
            recent_df = activities_df.loc[mask_7d].copy()
            load_7d = recent_df['TSS_Clean'].sum()

            # Prepare Recent Activities List
            recent_activities = []
            
            # Helper for safe float parsing
            def clean_metric(val):
                try:
                    return float(str(val).replace(',', '.'))
                except:
                    return 0.0

            if not recent_df.empty:
                recent_df = recent_df.sort_values(by='Date_Parsed', ascending=False)
                for _, row in recent_df.iterrows():
                    recent_activities.append({
                        "date": row['Date_Parsed'].strftime('%d.%m.%Y'),
                        "type": row.get('Type', 'Unknown'),
                        "duration": str(row.get('Time', '-')),
                        "tss": row['TSS_Clean'],
                        "distance": clean_metric(row.get('Distance', 0)),
                        "elevation": clean_metric(row.get('Total Ascent', 0))
                    })

    # --- Plan Processing ---
    todays_plan = None
    if not plan_df.empty:
        if 'Date' in plan_df.columns:
            plan_df['Date'] = pd.to_datetime(plan_df['Date'], dayfirst=True, errors='coerce')
            plan_match = plan_df[plan_df['Date'].dt.date == today]
            if not plan_match.empty:
                todays_plan = plan_match.iloc[0].to_dict()

    # --- History Processing ---
    history_days = 90
    history_start = today - timedelta(days=history_days)
    daily_tss = {}
    if not activities_df.empty and 'Date_Parsed' in activities_df.columns:
        act_hist = activities_df[activities_df['Date_Parsed'].dt.date >= history_start]
        for d, group in act_hist.groupby(act_hist['Date_Parsed'].dt.date):
            daily_tss[d] = group['TSS_Clean'].sum()

    history_data = []
    vitals_by_date = {}
    if not vitals_df.empty and 'Date_Parsed' in vitals_df.columns:
         vitals_hist = vitals_df[vitals_df['Date_Parsed'].dt.date >= history_start]
         for _, row in vitals_hist.iterrows():
             vitals_by_date[row['Date_Parsed'].date()] = row

    for i in range(history_days + 1):
        d_py = history_start + timedelta(days=i)
        d_str = d_py.strftime('%d.%m.%Y')
        tss_val = daily_tss.get(d_py, 0)
        vital_row = vitals_by_date.get(d_py, {})
        
        rec = 0
        score_val = 0
        bed_time = None
        wake_time = None
        
        if isinstance(vital_row, pd.Series):
             vital_dict = vital_row.to_dict()
             rec = calculate_recovery(vital_dict)
             score_val = safe_float(vital_dict.get('Score', 0))
             bed_time = vital_dict.get('Bedtime', None)
             wake_time = vital_dict.get('Wake Time', None)
        
        history_data.append({
            "date": d_py.isoformat(),
            "date_label": d_str,
            "tss": float(tss_val),
            "recovery": rec,
            "sleep_score": score_val,
            "bed_time": bed_time,
            "wake_time": wake_time
        })

    if not latest_vitals:
        # Explicit empty state if no data for today found
         latest_vitals = {
            "hrv": {"value": 0, "avg_7d": 0, "change": 0},
            "rhr": {"value": 0, "avg_7d": 0, "change": 0}, 
            "sleep_score": {"value": 0, "avg_7d": 0, "change": 0}, 
            "sleep_hours": 0, 
            "recovery_score": 0
        }

    # --- Weekly Distance Comparison (Spider Chart) ---
    weekly_distance_comparison = []
    try:
        def parse_planned_km(details_str):
            """Extract km from strings like '9-10 km', '12-13 km easy', '6-8 km'."""
            if not details_str or not isinstance(details_str, str):
                return 0.0
            # Match patterns like "9-10 km" or "10 km" or "12-13km"
            match = re.search(r'(\d+(?:[.,]\d+)?)(?:\s*[-–]\s*(\d+(?:[.,]\d+)?))?\s*km', details_str, re.IGNORECASE)
            if match:
                low = float(match.group(1).replace(',', '.'))
                high = float(match.group(2).replace(',', '.')) if match.group(2) else low
                return round((low + high) / 2, 1)
            return 0.0

        if not plan_df.empty and 'Date' in plan_df.columns:
            plan_df_copy = plan_df.copy()
            plan_df_copy['Date_Parsed'] = pd.to_datetime(plan_df_copy['Date'], dayfirst=True, errors='coerce')
            plan_df_copy['planned_km'] = plan_df_copy['Details'].apply(parse_planned_km)
            plan_df_copy['CW'] = plan_df_copy['Date_Parsed'].dt.isocalendar().week.astype(int)
            plan_df_copy['Year'] = plan_df_copy['Date_Parsed'].dt.isocalendar().year.astype(int)

            # Sum planned km per calendar week
            planned_by_week = plan_df_copy.groupby(['Year', 'CW'])['planned_km'].sum().reset_index()

            # Sum actual km per calendar week from activities
            actual_by_week = {}
            if not activities_df.empty and 'Date_Parsed' in activities_df.columns:
                act_copy = activities_df.copy()
                act_copy['CW'] = act_copy['Date_Parsed'].dt.isocalendar().week.astype(int)
                act_copy['Year'] = act_copy['Date_Parsed'].dt.isocalendar().year.astype(int)
                act_copy['dist_clean'] = act_copy.get('Distance', pd.Series(dtype=str)).astype(str).str.replace(',', '.', regex=False)
                act_copy['dist_clean'] = pd.to_numeric(act_copy['dist_clean'], errors='coerce').fillna(0)
                for _, grp in act_copy.groupby(['Year', 'CW']):
                    actual_by_week[(int(grp['Year'].iloc[0]), int(grp['CW'].iloc[0]))] = round(grp['dist_clean'].sum(), 1)

            # Build last 6 weeks
            today_ts = pd.Timestamp(today)
            current_cw = today_ts.isocalendar().week
            current_year = today_ts.isocalendar().year

            for w in range(5, -1, -1):  # 6 weeks back
                ref_date = today_ts - pd.Timedelta(weeks=w)
                cw = ref_date.isocalendar().week
                yr = ref_date.isocalendar().year

                planned_row = planned_by_week[(planned_by_week['CW'] == cw) & (planned_by_week['Year'] == yr)]
                planned_km = round(float(planned_row['planned_km'].iloc[0]), 1) if not planned_row.empty else 0.0
                actual_km = actual_by_week.get((int(yr), int(cw)), 0.0)

                weekly_distance_comparison.append({
                    "week_label": f"KW {int(cw)}",
                    "planned_km": planned_km,
                    "actual_km": actual_km
                })
    except Exception as e:
        print(f"Error computing weekly distance comparison: {e}")
        weekly_distance_comparison = []

    # --- Daily Distance Comparison (last 7 days spider chart) ---
    daily_distance_comparison = []
    try:
        if not plan_df.empty and 'Date' in plan_df.columns:
            plan_daily = plan_df.copy()
            plan_daily['Date_Parsed'] = pd.to_datetime(plan_daily['Date'], dayfirst=True, errors='coerce')
            plan_daily['planned_km'] = plan_daily['Details'].apply(parse_planned_km)
            plan_daily = plan_daily.groupby('Date_Parsed')['planned_km'].sum().reset_index()

            # Actual km by date
            actual_by_date = {}
            if not activities_df.empty and 'Date_Parsed' in activities_df.columns:
                act_d = activities_df.copy()
                act_d['dist_clean'] = act_d.get('Distance', pd.Series(dtype=str)).astype(str).str.replace(',', '.', regex=False)
                act_d['dist_clean'] = pd.to_numeric(act_d['dist_clean'], errors='coerce').fillna(0)
                for d, grp in act_d.groupby(act_d['Date_Parsed'].dt.date):
                    actual_by_date[d] = round(grp['dist_clean'].sum(), 1)

            for i in range(6, -1, -1):  # last 7 days
                ref_date = today - timedelta(days=i)
                ref_ts = pd.Timestamp(ref_date)

                plan_row = plan_daily[plan_daily['Date_Parsed'].dt.date == ref_date]
                planned_km = round(float(plan_row['planned_km'].iloc[0]), 1) if not plan_row.empty else 0.0
                actual_km = actual_by_date.get(ref_date, 0.0)

                daily_distance_comparison.append({
                    "day_label": ref_ts.strftime('%a %d.%m'),
                    "planned_km": planned_km,
                    "actual_km": actual_km
                })
    except Exception as e:
        print(f"Error computing daily distance comparison: {e}")
        daily_distance_comparison = []

    # 3. Construct ViewModel
    return {
        "date": today.isoformat(),
        "vitals": latest_vitals,
        "strain": {
            "today": float(today_strain), 
            "load_7d": float(load_7d),
            "status": "Building" 
        },
        "plan": todays_plan,
        "recommendation": determine_recommendation(latest_vitals, load_7d, todays_plan),
        "recent_activities": recent_activities if 'recent_activities' in locals() else [],
        "tss_chart_data": sorted(recent_activities, key=lambda x: datetime.strptime(x['date'], '%d.%m.%Y')) if 'recent_activities' in locals() else [],
        "history": history_data,
        "endurance": endurance_data if 'endurance_data' in locals() else {},
        "hrv_history": hrv_history if 'hrv_history' in locals() else [],
        "weekly_distance_comparison": weekly_distance_comparison,
        "daily_distance_comparison": daily_distance_comparison
    }

def calculate_recovery(vitals_row):
    """
    Calculates a Whoop-style recovery score (0-100).
    Simple Mock Logic for V1.
    """
    # Needs real implementation based on user rules
    # HRV weighting + RHR weighting + Sleep
    try:
        hrv = float(vitals_row.get("HRV Status", 50))
        rhr = float(vitals_row.get("Resting Heart Rate", 60))
        sleep = float(vitals_row.get("Score", 80))
        
        # Simple weighted algo
        score = (hrv * 0.5) + (sleep * 0.3) + ((100-rhr) * 0.2) 
        return min(max(int(score), 1), 99)
    except:
        return 50

def determine_recommendation(vitals, load, plan):
    """
    Rule-based recommendation engine v1.
    """
    rec_text = "Plan einhalten."
    action = "HOLD"
    
    recovery = vitals.get("recovery_score", 50)
    
    if recovery < 33:
        rec_text = "Niedrige Erholung. Fokus auf Schlaf und Ernährung. Training reduzieren."
        action = "REDUCE"
    elif recovery > 66:
        rec_text = "Hohe Erholung! Du bist bereit für Belastung."
        action = "PUSH"
        
    return {
        "text": rec_text,
        "action": action
    }

def get_boxplot_data(metric="pace", segmentation="week", start_date=None, end_date=None, run_type=None, sport_type=None):
    """
    Calculates boxplot statistics for the requested metric and segmentation.
    Metric: 'pace' or 'hr'
    Segmentation: 'week' or 'run_type'
    """
    # 1. Load Data
    df_g2 = data_loader.load_sheet_data(SPREADSHEET_ID, "Garmin2!A:ZZ")
    df_aw = data_loader.load_sheet_data(SPREADSHEET_ID, "All_Workouts!A:AZ")
    
    if df_g2.empty or df_aw.empty:
        return {"error": "Could not load data from sheets"}
    
    # 2. Join Data
    # all_workouts.id == Garmin2.Strava_ID
    # Check if columns exist
    if 'Strava_ID' not in df_g2.columns:
        return {"error": f"Column 'Strava_ID' not found in Garmin2. Available: {df_g2.columns.tolist()[:10]}..."}
    if 'id' not in df_aw.columns:
        return {"error": f"Column 'id' not found in All_Workouts. Available: {df_aw.columns.tolist()[:10]}..."}

    df_aw['id'] = df_aw['id'].astype(str).str.strip()
    df_g2['Strava_ID'] = df_g2['Strava_ID'].astype(str).str.strip()
    
    merged = pd.merge(df_g2, df_aw, left_on='Strava_ID', right_on='id', how='inner', suffixes=('', '_aw'))
    
    if merged.empty:
        return {"error": "No data found after joining activities"}

    # 3. Clean and Parse
    # Parse Date
    merged['Date_Parsed'] = pd.to_datetime(merged['start_date'], dayfirst=True, errors='coerce')
    
    # helper to clean HR and Pace (e.g. "359,61" -> 359.61)
    def clean_numeric(val):
        if not val or val == '':
            return np.nan
        try:
            return float(str(val).replace(',', '.'))
        except:
            return np.nan

    merged['HR_Numeric'] = merged['Avg HR'].apply(clean_numeric)
    # Pace_Raw is already seconds (or numeric equivalent) but with comma
    merged['Pace_Seconds'] = merged['Pace_Raw'].apply(clean_numeric)

    # 4. Filter
    if start_date:
        start_ts = pd.to_datetime(start_date)
        merged = merged[merged['Date_Parsed'] >= start_ts]
    if end_date:
        end_ts = pd.to_datetime(end_date)
        merged = merged[merged['Date_Parsed'] <= end_ts]
    
    if run_type and run_type != 'all':
        # Spalte activity_type_display_name in All_Workouts (joined as activity_type_display_name)
        merged = merged[merged['activity_type_display_name'] == run_type]
    
    if sport_type and sport_type != 'all':
        # Spalte type in All_Workouts
        merged = merged[merged['type'] == sport_type]

    # Drop NaNs for the target metric
    target_col = 'Pace_Seconds' if metric == 'pace' else 'HR_Numeric'
    filtered = merged.dropna(subset=[target_col])
    
    if filtered.empty:
        return {"data": [], "message": "No data available for selected filters"}

    # 5. Segment
    if segmentation == 'week':
        filtered['group'] = filtered['Date_Parsed'].dt.isocalendar().week
        label_prefix = "KW "
    else:
        filtered['group'] = filtered['activity_type_display_name']
        label_prefix = ""

    # 6. Calculate Boxplot Stats
    def get_stats(group):
        q1 = group[target_col].quantile(0.25)
        median = group[target_col].quantile(0.5)
        q3 = group[target_col].quantile(0.75)
        mi = group[target_col].min()
        ma = group[target_col].max()
        
        return pd.Series({
            'min': float(mi),
            'q1': float(q1),
            'median': float(median),
            'q3': float(q3),
            'max': float(ma),
            'count': int(len(group))
        })

    result = filtered.groupby('group').apply(get_stats).reset_index()
    
    # Format labels
    result['label'] = result['group'].apply(lambda x: f"{label_prefix}{x}")
    
    # Sort
    if segmentation == 'week':
        result = result.sort_values('group')
    
    return {
        "metric": metric,
        "segmentation": segmentation,
        "data": result.to_dict(orient='records'),
        "available_run_types": merged['activity_type_display_name'].dropna().unique().tolist(),
        "available_sport_types": merged['type'].dropna().unique().tolist()
    }
