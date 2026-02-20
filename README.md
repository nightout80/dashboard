# Whoop-Style Dashboard

## Prerequisites
1.  **Python 3.9+**
2.  **Node.js 18+** (Required for the Frontend) -> [Download here](https://nodejs.org/)

## Setup

### Backend
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the server:
    ```bash
    python main.py
    ```
    The API will run at `http://localhost:8000`.

### Frontend
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will run at `http://localhost:5173`.

## Architecture
- **Backend**: FastAPI (Python) - Handles data loading and logic.
- **Frontend**: React + Vite (JS) - Renders the UI using `design_tokens.json`.
- **Design System**: Controlled via `design_tokens.json` in the root directory.
