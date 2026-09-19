@echo off
ECHO Starting Heart Disease Project Backend and Frontend...

REM --- 1. Start Python Backend in the background ---
start cmd /k "cd /d "%~dp0" && .\.venv\Scripts\activate && python main.py"

REM --- 2. Start Node.js Frontend in the background ---
REM Note: Replace 'npm start' with the correct command if your package.json uses something else
start cmd /k "cd /d "%~dp0frontend" && npm start"

ECHO The web application should now be running.
ECHO Please wait a few seconds for the browser window to open.
timeout /t 5
start http://localhost:3000
exit