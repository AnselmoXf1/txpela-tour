@echo off
echo ========================================
echo CORRIGIR CORS - DEPLOY NO RENDER
echo ========================================
echo.

echo Verificando alteracoes...
git status

echo.
echo Adicionando arquivos...
git add backend/txopela_backend/settings.py
git add backend/txopela_backend/urls.py

echo.
echo Fazendo commit...
git commit -m "Fix CORS configuration for production"

echo.
echo Fazendo push para GitHub...
git push origin main

echo.
echo ========================================
echo PUSH CONCLUIDO!
echo ========================================
echo.
echo Agora:
echo 1. Acesse: https://dashboard.render.com
echo 2. Aguarde o deploy automatico (2-3 min)
echo 3. Configure a variavel CORS_ALLOWED_ORIGINS:
echo.
echo    https://txopela-tour.vercel.app,https://txopela-admin.vercel.app,https://txopela-business.vercel.app
echo.
echo 4. Aguarde o redeploy
echo 5. Teste o frontend novamente
echo.
pause
