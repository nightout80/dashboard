from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
import os

app = FastAPI(title="Whoop-Style Dashboard API")

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import logic

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Whoop-Style Dashboard API is running"}

@app.get("/api/dashboard")
def get_dashboard():
    try:
        data = logic.get_dashboard_data()
        return data
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/design-tokens")
def get_design_tokens():
    # Load from parent directory
    token_path = os.path.join(os.path.dirname(__file__), "..", "design_tokens.json")
    if os.path.exists(token_path):
        with open(token_path, "r") as f:
            return json.load(f)
    return {"error": "design_tokens.json not found"}

@app.get("/api/boxplot")
def get_boxplot(
    metric: str = "pace",
    segmentation: str = "week",
    startDate: str = None,
    endDate: str = None,
    runType: str = None,
    sportType: str = None
):
    try:
        data = logic.get_boxplot_data(metric, segmentation, startDate, endDate, runType, sportType)
        return data
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
