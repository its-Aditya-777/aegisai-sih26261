@echo off
setlocal
cd /d "%~dp0"
echo ==============================================
echo   AegisAI - SIH26261 prototype
 echo ==============================================
if not exist ".venv\Scripts\python.exe" (
  echo Creating a local Python environment...
  py -3.12 -m venv .venv 2>nul
  if errorlevel 1 (
    python -m venv .venv
  )
)
if not exist ".venv\Scripts\python.exe" (
  echo Could not create the virtual environment. Install Python 3.11 or newer and try again.
  pause
  exit /b 1
)
echo Installing / checking dependencies. This requires internet access the first time.
".venv\Scripts\python.exe" -m pip install --upgrade pip
if errorlevel 1 goto :failed
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto :failed
echo.
echo Starting AegisAI. Keep this window open while using the app.
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process 'http://127.0.0.1:5000'"
".venv\Scripts\python.exe" app.py
pause
exit /b 0
:failed
echo.
echo Dependency installation failed. Check your internet connection and Python installation.
pause
exit /b 1
