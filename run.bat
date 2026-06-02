@echo off
SETLOCAL EnableDelayedExpansion

:: --- Configuration ---
SET PROJECT_NAME=Personal Portfolio
SET START_COMMAND=npm run dev

:: --- UI Colors ---
:: Note: Windows CMD color codes (0=Black, 9=Light Blue, A=Light Green, B=Light Aqua, E=Light Yellow, F=Bright White)
:: We'll use ANSI escape codes for better colors if supported, or fall back to standard echo

echo.
echo ============================================================
echo           Launching !PROJECT_NAME!
echo ============================================================
echo.

:: --- Dependency Check ---
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] npm install failed. Please check your internet connection and try again.
        pause
        exit /b !ERRORLEVEL!
    )
    echo [SUCCESS] Dependencies installed.
) else (
    echo [INFO] Dependencies already installed.
)

:: --- Run Project ---
echo.
echo [INFO] Starting development server with: !START_COMMAND!
echo.
echo ------------------------------------------------------------
call !START_COMMAND!

:: --- Error Handling ---
if !ERRORLEVEL! NEQ 0 (
    echo.
    echo [ERROR] The application crashed or was stopped unexpectedly.
    pause
)

ENDLOCAL
