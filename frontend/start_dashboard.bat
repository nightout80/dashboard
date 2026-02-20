@echo off
echo Starting Whoop Dashboard Frontend...
echo.
REM Using npm.cmd explicitly to avoid PowerShell script execution policy issues
call npm.cmd run dev
pause
