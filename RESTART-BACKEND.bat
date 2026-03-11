@echo off
echo ========================================
echo Reiniciando Backend
echo ========================================
echo.

echo [1/3] Parando processos Python...
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Limpando cache...
cd backend
if exist __pycache__ rmdir /s /q __pycache__
if exist pontos_turisticos\__pycache__ rmdir /s /q pontos_turisticos\__pycache__
if exist txopela_backend\__pycache__ rmdir /s /q txopela_backend\__pycache__
if exist authentication\__pycache__ rmdir /s /q authentication\__pycache__
if exist ai_service\__pycache__ rmdir /s /q ai_service\__pycache__

echo [3/3] Iniciando backend...
echo.
echo Backend iniciando em http://localhost:8000
echo.
python manage.py runserver

pause
