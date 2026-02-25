#!/bin/bash
# Raspberry Pi Deployment Helper

echo "--- Whoop Dashboard Deployment Helper ---"

# 1. Pull latest changes
echo "Pulling latest changes from git..."
git pull

# 2. Restart backend service
echo "Restarting whoop-api service..."
sudo systemctl restart whoop-api

# 3. Build frontend (if needed)
# cd frontend && npm run build
# Or just let it run in dev mode if that's how it's used on the Pi

echo "Deployment finished! Check status with: sudo systemctl status whoop-api"
