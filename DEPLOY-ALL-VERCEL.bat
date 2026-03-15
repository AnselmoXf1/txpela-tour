@echo off
echo ========================================
echo DEPLOY COMPLETO - TODAS AS INTERFACES
echo ========================================
echo.
echo Este script vai fazer deploy de:
echo 1. Frontend Principal (Txopela Tour)
echo 2. Admin App
echo 3. Business App
echo.
echo Pressione qualquer tecla para continuar...
pause > nul

echo.
echo ========================================
echo 1/3 - FRONTEND PRINCIPAL
echo ========================================
call DEPLOY-FRONTEND.bat

echo.
echo ========================================
echo 2/3 - ADMIN APP
echo ========================================
call DEPLOY-ADMIN.bat

echo.
echo ========================================
echo 3/3 - BUSINESS APP
echo ========================================
call DEPLOY-BUSINESS.bat

echo.
echo ========================================
echo ✅ TODOS OS DEPLOYS CONCLUIDOS!
echo ========================================
echo.
echo URLs esperadas:
echo - Frontend: https://txopela-tour.vercel.app
echo - Admin: https://txopela-admin.vercel.app
echo - Business: https://txopela-business.vercel.app
echo.
echo Nao esqueca de atualizar o CORS no Render!
echo.
pause
