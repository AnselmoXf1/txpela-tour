@echo off
echo ========================================
echo   TESTE COMPLETO - TXOPELA TOUR
echo ========================================
echo.

echo 1. VERIFICANDO DEPENDÊNCIAS...
echo.

echo 1.1 Verificando Python e pip...
python --version
if %errorlevel% neq 0 (
    echo ERRO: Python não encontrado!
    echo Instale Python 3.8+ em: https://python.org
    pause
    exit /b 1
)

echo.
echo 2. CONFIGURANDO BACKEND...
cd backend

echo 2.1 Ativando ambiente virtual...
call venv\Scripts\activate

echo 2.2 Instalando dependências...
pip install -r requirements.txt

echo 2.3 Aplicando migrações...
python manage.py makemigrations
python manage.py migrate

echo 2.4 Criando superusuário (opcional)...
echo. | python manage.py createsuperuser --username=admin --email=admin@txopela.com

echo.
echo 3. CONFIGURANDO BUSINESS APP...
cd ..
cd business-app

echo 3.1 Instalando dependências...
call npm install

echo.
echo 4. CONFIGURANDO CLIENT APP...
cd ..
cd frontend-vite

echo 4.1 Instalando dependências...
call npm install

echo.
echo ========================================
echo   CONFIGURAÇÃO COMPLETA!
echo ========================================
echo.
echo Para iniciar o sistema, abra 3 terminais:
echo.
echo TERMINAL 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo TERMINAL 2 (Business App):
echo   cd business-app
echo   npm run dev
echo.
echo TERMINAL 3 (Client App):
echo   cd frontend-vite
echo   npm run dev
echo.
echo URLs:
echo   Backend API: http://localhost:8000
echo   Admin: http://localhost:8000/admin
echo   Business App: http://localhost:5174
echo   Client App: http://localhost:5173
echo.
echo ========================================
echo   TESTE RÁPIDO
echo ========================================
echo 1. Acesse http://localhost:5174
echo    Cadastre um negócio
echo 2. Acesse http://localhost:5173
echo    Veja os posts do negócio
echo 3. Teste o chat entre cliente e negócio
echo.
pause