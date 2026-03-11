@echo off
echo ========================================
echo   TESTE COMPLETO - BUSINESS FLOW
echo ========================================
echo.
echo Este script vai testar:
echo   1. Cadastro de negócio
echo   2. Login
echo   3. Acesso ao perfil
echo.
echo Certifique-se de que o backend está rodando!
echo.
pause

cd backend
call venv\Scripts\activate
python test-business-flow.py

echo.
pause
