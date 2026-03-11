@echo off
echo ========================================
echo   TESTE DE CADASTRO DE NEGÓCIO
echo ========================================
echo.
echo Certifique-se de que o backend está rodando!
echo.
pause

cd backend
call venv\Scripts\activate
python test-business-register.py

echo.
pause
