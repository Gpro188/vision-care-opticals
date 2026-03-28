@echo off
color 0A
title Fix Repository Structure
cls

echo ================================================================
echo        FIXING REPOSITORY - Adding All Website Files
echo ================================================================
echo.

cd /d "%~dp0"

echo Removing old Git history...
if exist ".git" (
    rmdir /s /q .git
    echo [+] Removed old .git folder
)

echo.
echo Initializing fresh Git repository...
git init
echo [+] Git initialized

echo.
echo Adding ALL files (including vision care folder)...
git add .
echo [+] All files added

echo.
echo Committing...
git commit -m "Complete Vision Care website with all admin data and files"
echo [+] Committed

git branch -M main

echo.
echo Connecting to GitHub...
git remote add origin https://github.com/gpro188/visioncare-website.git
echo [+] Connected to GitHub

echo.
echo Pushing to GitHub...
echo.
echo ========================================
echo When asked for password, use your Personal Access Token
echo Get it from: https://github.com/settings/tokens
echo ========================================
echo.
pause
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo SUCCESS! All files pushed to GitHub!
    echo ================================================================
    echo.
    echo Vercel will now auto-deploy everything.
    echo Go to: https://vercel.com/dashboard
    echo.
) else (
    echo.
    echo [!] Push failed. Check error above.
)

echo.
pause
