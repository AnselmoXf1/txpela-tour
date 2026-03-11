@echo off
echo ========================================
echo Iniciando Txopela Tour Ecosystem
echo ========================================
echo.

cd /d "%~dp0"

echo Este script abrira 3 terminais:
echo 1. Backend API (porta 8000)
echo 2. Client App (porta 5173)
echo 3. Admin App (porta 3001)
echo.
pause

echo.
echo [1/3] Iniciando Backend...
start "Txopela Backend" cmd /k "cd backend && start-backend.bat"

timeout /t 3 /nobreak >nul

echo [2/3] Iniciando Client App...
if exist "client-app" (
    start "Txopela Client" cmd /k "cd client-app && npm run dev"
) else if exist "frontend-vite" (
    start "Txopela Client" cmd /k "cd frontend-vite && npm run dev"
) else (
    echo [!] Client app nao encontrado!
)

timeout /t 2 /nobreak >nul

echo [3/3] Iniciando Admin App...
if exist "admin-app" (
    start "Txopela Admin" cmd /k "cd admin-app && npm run dev"
) else (
    echo [!] Admin app nao encontrado! Execute CREATE-ADMIN-APP.bat primeiro.
)

echo.
echo ========================================
echo Ecosystem iniciado!
echo ========================================
echo.
echo URLs:
echo - Backend: http://localhost:8000
echo - Client:  http://localhost:5173
echo - Admin:   http://localhost:3001
echo.
echo Pressione qualquer tecla para fechar este terminal...
pause >nul
