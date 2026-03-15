@echo off
echo ========================================
echo DEPLOY FRONTEND PRINCIPAL NO VERCEL
echo ========================================
echo.

cd frontend-vite

echo Instalando dependencias...
call npm install

echo.
echo Testando build...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Erro no build! Corrija os erros antes de fazer deploy.
    pause
    exit /b 1
)

echo.
echo ✅ Build OK!
echo.
echo Fazendo deploy no Vercel...
echo.

call vercel --prod

echo.
echo ========================================
echo DEPLOY CONCLUIDO!
echo ========================================
echo.
echo Acesse: https://vercel.com/dashboard
echo Para ver o status do deploy
echo.
pause
