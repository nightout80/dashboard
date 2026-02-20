import pandas as pd
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Scopes: read-only is sufficient; using read-write because SA was set up with it
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

PLAN_CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "Engelberg_2026.csv")
SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(__file__), "..", "service_account.json")


def load_plan_data():
    """Loads the csv plan data."""
    if not os.path.exists(PLAN_CSV_PATH):
        print(f"Plan file not found at {PLAN_CSV_PATH}")
        return pd.DataFrame()

    try:
        df = pd.read_csv(PLAN_CSV_PATH)
        return df
    except UnicodeDecodeError:
        try:
            df = pd.read_csv(PLAN_CSV_PATH, encoding='latin1', sep=';')
            if df.shape[1] == 1:
                df = pd.read_csv(PLAN_CSV_PATH, encoding='latin1', sep=',')
            return df
        except Exception as e:
            print(f"Error reading CSV plan with fallback encoding: {e}")
            return pd.DataFrame()
    except Exception as e:
        print(f"Error reading CSV plan: {e}")
        return pd.DataFrame()


def get_google_creds():
    """Returns service account credentials — no browser, no token files."""
    if not os.path.exists(SERVICE_ACCOUNT_PATH):
        print(f"Service account file not found at {SERVICE_ACCOUNT_PATH}")
        return None
    try:
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_PATH,
            scopes=SCOPES
        )
        return creds
    except Exception as e:
        print(f"Error loading service account credentials: {e}")
        return None


def load_sheet_data(spreadsheet_id, range_name):
    """Loads data from a specific range in the Google Sheet."""
    creds = get_google_creds()
    if not creds:
        print("No valid credentials found.")
        return pd.DataFrame()

    try:
        service = build("sheets", "v4", credentials=creds)
        sheet = service.spreadsheets()
        result = (
            sheet.values()
            .get(spreadsheetId=spreadsheet_id, range=range_name)
            .execute()
        )
        values = result.get("values", [])

        if not values:
            print(f"No data found in range {range_name}.")
            return pd.DataFrame()

        # Assume first row is header
        df = pd.DataFrame(values[1:], columns=values[0])
        return df

    except HttpError as err:
        print(f"HTTP Error calling Google Sheets API: {err}")
        return pd.DataFrame()
    except Exception as e:
        print(f"Error loading sheet data: {e}")
        return pd.DataFrame()


if __name__ == "__main__":
    print("Testing service account connection...")
    creds = get_google_creds()
    if creds:
        print(f"OK  Credentials loaded for: {creds.service_account_email}")
    else:
        print("FAIL  Could not load credentials")

    print("\nLoading Plan CSV...")
    df = load_plan_data()
    print(df.head())
