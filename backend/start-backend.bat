@echo off
echo ========================================
echo Iniciando Backend - Txopela Tour
echo ========================================
echo.

cd /d "%~dp0"

if not exist "venv\Scripts\activate.bat" (
    echo [!] Ambiente virtual nao encontrado!
    echo [!] Execute primeiro: install-dependencies.bat
    echo.
    pause
    exit /b 1
)

echo [1/2] Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo [2/2] Iniciando servidor Django...
echo.
echo ✓ Backend rodando em: http://localhost:8000
echo ✓ Admin em: http://localhost:8000/admin
echo ✓ API em: http://localhost:8000/api
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

venv\Scripts\python.exe manage.py runserver
