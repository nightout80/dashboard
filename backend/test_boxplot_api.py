import requests
import json

def test_boxplot_endpoint():
    url = "http://localhost:8000/boxplot"
    
    # Test 1: Default (Pace, Week)
    print("Testing default (pace, week)...")
    try:
        r = requests.get(url, params={"metric": "pace", "segmentation": "week"})
        data = r.json()
        if "error" in data:
            print(f"Error: {data['error']}")
        else:
            print(f"Success! Found {len(data['data'])} groups.")
            if data['data']:
                print(f"Sample Group: {data['data'][0]['label']}")
    except Exception as e:
        print(f"Failed to connect to server: {e}. Is it running?")

if __name__ == "__main__":
    test_boxplot_endpoint()
