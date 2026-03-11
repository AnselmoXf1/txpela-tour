@echo off
color 0A
echo.
echo ========================================
echo   TXOPELA TOUR - INICIAR TUDO
echo ========================================
echo.
echo Este script vai preparar e iniciar:
echo   1. Backend (Django API)
echo   2. Business App (Painel de Negócios)
echo   3. Client App (App do Cliente)
echo.
echo ========================================
pause

echo.
echo [1/3] BACKEND - Migrações
echo ========================================
cd backend
call venv\Scripts\activate
python manage.py makemigrations business_panel
python manage.py migrate
echo Backend pronto!
cd ..

echo.
echo [2/3] BUSINESS APP - Dependências
echo ========================================
cd business-app
if not exist node_modules (
    echo Instalando dependências...
    call npm install
) else (
    echo Dependências já instaladas!
)
cd ..

echo.
echo [3/3] CLIENT APP - Verificação
echo ========================================
cd frontend-vite
if not exist node_modules (
    echo Instalando dependências...
    call npm install
) else (
    echo Dependências já instaladas!
)
cd ..

echo.
echo ========================================
echo   TUDO PRONTO!
echo ========================================
echo.
echo Agora abra 3 TERMINAIS separados:
echo.
echo TERMINAL 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo   URL: http://localhost:8000
echo.
echo TERMINAL 2 - Business App:
echo   cd business-app
echo   npm run dev
echo   URL: http://localhost:5174
echo.
echo TERMINAL 3 - Client App:
echo   cd frontend-vite
echo   npm run dev
echo   URL: http://localhost:5173
echo.
echo ========================================
echo   ORDEM DE TESTE
echo ========================================
echo.
echo 1. Cadastre um negócio em: http://localhost:5174/register
echo 2. Faça login e crie posts/promoções
echo 3. Veja os posts no app cliente: http://localhost:5173
echo.
pause
