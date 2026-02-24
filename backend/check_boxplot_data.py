import logic
import data_loader

def check_boxplot_data():
    spreadsheet_id = logic.SPREADSHEET_ID
    df = data_loader.load_sheet_data(spreadsheet_id, "Boxplot!A:AZ")
    if not df.empty:
        print(f"Columns: {df.columns.tolist()}")
        print(df.head(20))
    else:
        print("Boxplot sheet is empty.")

if __name__ == "__main__":
    check_boxplot_data()
