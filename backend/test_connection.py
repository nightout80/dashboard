import logic
import json

def test():
    print("Testing get_dashboard_data()...")
    try:
        data = logic.get_dashboard_data()
        print("Data received successfully!")
        print(json.dumps(data, indent=2, default=str))
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    test()
