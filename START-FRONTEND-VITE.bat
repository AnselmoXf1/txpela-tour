@echo off
echo ========================================
echo   Iniciando Frontend Vite (Recomendado)
echo ========================================
echo.
echo Porta: http://localhost:5173
echo.

cd frontend-vite

if not exist "node_modules" (
    echo [!] Dependencias nao encontradas!
    echo [!] Instalando dependencias...
    echo.
    call npm install
)

echo Iniciando servidor Vite...
echo.
echo ✓ Frontend rodando em: http://localhost:5173
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

npm run dev
