@echo off
echo Installing Whoop Dashboard Dependencies (Recharts)...
echo.
call npm.cmd install
call npm.cmd install recharts
echo.
echo Installation Complete. Now run start_dashboard.bat!
pause
