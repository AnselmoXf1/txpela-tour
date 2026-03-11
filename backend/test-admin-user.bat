@echo off
echo ========================================
echo Verificando Usuario Admin
echo ========================================
echo.

cd /d "%~dp0"

if not exist "venv\Scripts\activate.bat" (
    echo [!] Ambiente virtual nao encontrado!
    echo [!] Execute primeiro: install-dependencies.bat
    pause
    exit /b 1
)

call venv\Scripts\activate.bat
python test-admin-user.py

echo.
pause
