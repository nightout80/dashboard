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

## Raspberry Pi Deployment

For a stable deployment on a Raspberry Pi, it's recommended to use **systemd** to manage the services and **Nginx** as a reverse proxy.

### 1. Systemd Service (Backend)
Create a service file to keep the backend running:
```bash
sudo nano /etc/systemd/system/whoop-api.service
```
Paste this configuration (adjust paths):
```ini
[Unit]
Description=Whoop Dashboard API
After=network.target

[Service]
User=pi
WorkingDirectory=/home/pi/Whoop/backend
ExecStart=/usr/bin/python3 main.py
Restart=always

[Install]
WantedBy=multi-user.target
```
Start and enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable whoop-api
sudo systemctl start whoop-api
```

### 2. Nginx Configuration
Update your Nginx config to handle the new `/api` prefix:
```nginx
location /api/ {
    proxy_pass http://localhost:8000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## Architecture
- **Backend**: FastAPI (Python) - Handles data loading and logic. Now uses `/api` prefix for all endpoints.
- **Frontend**: React + Vite (JS) - Renders the UI and proxies `/api` to the backend.
- **Design System**: Controlled via `design_tokens.json` in the root directory.
