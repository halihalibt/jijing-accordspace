@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "" chrome "http://127.0.0.1:8765"
  py -3 -m http.server 8765 --bind 127.0.0.1 --directory dist
  exit /b
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" chrome "http://127.0.0.1:8765"
  python -m http.server 8765 --bind 127.0.0.1 --directory dist
  exit /b
)
echo Python 3 is required for this local package. Use the hosted demo or install Python from python.org.
pause
