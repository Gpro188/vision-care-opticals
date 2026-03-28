@echo off
echo ========================================
echo   Vision Care Server Status Check
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo SOLUTION:
    echo 1. Go to https://nodejs.org
    echo 2. Download LTS version
    echo 3. Install with default settings
    echo 4. Restart computer
    echo 5. Try again
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
    node --version
    echo.
)

REM Check if server is already running
echo Checking if server is already running...
netstat -ano | findstr :3456 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Server is ALREADY running on port 3456!
    echo.
    echo Do you want to kill it and restart? (Y/N)
    set /p choice="Enter Y to restart, or N to keep running: "
    if /i "%choice%"=="Y" (
        echo Killing existing server...
        for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3456') do (
            taskkill /F /PID %%a >nul 2>&1
        )
        timeout /t 2 /nobreak >nul
        echo Done!
    ) else (
        echo Keeping existing server running.
        echo You can close this window.
        pause
        exit /b 0
    )
) else (
    echo [OK] No server running on port 3456
)

echo.
echo ========================================
echo   Starting Vision Care Data Server
echo ========================================
echo.
echo Server will start on: http://localhost:3456
echo Data file: data.json
echo.
echo Press Ctrl+C to stop the server
echo.
echo Starting now...
echo.

cd /d "%~dp0vision care"
node data-server.js

pause
