@echo off
echo ========================================
echo   TESTE COMPLETO - TXOPELA TOUR
echo ========================================
echo.

echo Este script vai testar:
echo 1. Backend (API principal + Business Panel)
echo 2. Frontend Cliente (com posts e mensagens)
echo 3. Business App (painel de negócios)
echo.

echo PASSO 1: Configurar Business Panel no Backend
echo ========================================
cd backend
call venv\Scripts\activate
echo.
echo Criando migrações...
python manage.py makemigrations business_panel
echo.
echo Aplicando migrações...
python manage.py migrate
echo.
echo Business Panel configurado!
echo.

cd ..

echo.
echo PASSO 2: Instalar dependências do Business App
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
echo ========================================
echo   CONFIGURAÇÃO COMPLETA!
echo ========================================
echo.
echo Para testar, abra 3 terminais:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo Terminal 2 - App Cliente:
echo   cd frontend-vite
echo   npm run dev
echo   Acesse: http://localhost:5173
echo.
echo Terminal 3 - Business App:
echo   cd business-app
echo   npm run dev
echo   Acesse: http://localhost:5174
echo.
echo ========================================
echo   FLUXO DE TESTE
echo ========================================
echo.
echo 1. Business App (localhost:5174):
echo    - Cadastre um negócio
echo    - Marque localização no mapa
echo    - Crie posts/promoções
echo.
echo 2. App Cliente (localhost:5173):
echo    - Veja os posts na Home (carrossel)
echo    - Arraste horizontalmente (sem scrollbar)
echo    - Envie mensagem para negócio
echo.
echo 3. Business App:
echo    - Veja mensagens recebidas
echo    - Responda mensagens
echo    - Veja estatísticas
echo.
pause
