@echo off
echo ========================================
echo   SETUP BUSINESS APP
echo ========================================
echo.

echo Removendo node_modules antigo...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Instalando dependências...
call npm install

echo.
echo ========================================
echo   SETUP COMPLETO!
echo ========================================
echo.
echo Para iniciar o app:
echo   npm run dev
echo.
echo Acesse: http://localhost:5174
echo.
pause
