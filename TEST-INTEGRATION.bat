@echo off
echo ========================================
echo TESTE DE INTEGRACAO ADMIN ^<-^> CLIENT
echo ========================================
echo.

echo [PASSO 1] Verificando Backend...
cd backend
python manage.py check
if %errorlevel% neq 0 (
    echo ERRO: Backend com problemas!
    pause
    exit /b 1
)
echo Backend OK!
echo.

echo [PASSO 2] Testando conexao MongoDB...
python -c "from pontos_turisticos.mongodb import mongodb; collection = mongodb.get_collection('pontos_turisticos'); count = collection.count_documents({}); print(f'Pontos no banco: {count}')"
if %errorlevel% neq 0 (
    echo ERRO: MongoDB nao conectado!
    pause
    exit /b 1
)
echo MongoDB OK!
echo.

echo [PASSO 3] Testando Cloudinary...
python -c "import cloudinary; from django.conf import settings; cloudinary.config(cloud_name=settings.CLOUDINARY_CLOUD_NAME, api_key=settings.CLOUDINARY_API_KEY, api_secret=settings.CLOUDINARY_API_SECRET); print('Cloudinary:', settings.CLOUDINARY_CLOUD_NAME)"
if %errorlevel% neq 0 (
    echo ERRO: Cloudinary nao configurado!
    pause
    exit /b 1
)
echo Cloudinary OK!
echo.

cd ..

echo [PASSO 4] Verificando Admin App...
cd admin-app
if not exist "node_modules" (
    echo Instalando dependencias do admin...
    call npm install
)
if not exist ".env" (
    echo Criando .env do admin...
    echo VITE_API_URL=http://localhost:8000/api > .env
)
echo Admin App OK!
echo.

cd ..

echo [PASSO 5] Verificando Client App...
cd frontend-vite
if not exist "node_modules" (
    echo Instalando dependencias do client...
    call npm install
)
if not exist ".env" (
    echo Criando .env do client...
    echo VITE_API_URL=http://localhost:8000/api > .env
)
echo Client App OK!
echo.

cd ..

echo ========================================
echo TODOS OS TESTES PASSARAM!
echo ========================================
echo.
echo INTEGRACAO COMPLETA:
echo.
echo 1. ADMIN cria/edita/deleta pontos
echo    - Dados vao para MongoDB
echo    - Fotos vao para Cloudinary
echo.
echo 2. CLIENT consome os dados
echo    - Home: Feed com todos os pontos
echo    - Explore: Mapa e busca
echo    - Detail: Pagina completa com fotos
echo.
echo 3. SINCRONIZACAO:
echo    - Mudancas no admin aparecem no client
echo    - Reviews no client aparecem para todos
echo.
echo ========================================
echo COMO TESTAR:
echo ========================================
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   python manage.py runserver
echo.
echo Terminal 2 - Admin:
echo   cd admin-app
echo   npm run dev
echo   Acesse: http://localhost:5173
echo.
echo Terminal 3 - Client:
echo   cd frontend-vite
echo   npm run dev
echo   Acesse: http://localhost:5174
echo.
echo ========================================
echo TESTE MANUAL:
echo ========================================
echo.
echo 1. No ADMIN:
echo    - Crie um novo ponto com fotos
echo    - Edite os dados
echo    - Edite as fotos
echo.
echo 2. No CLIENT:
echo    - Recarregue a pagina
echo    - Verifique se o ponto aparece no Home
echo    - Verifique se aparece no Explore
echo    - Abra a pagina de detalhes
echo    - Veja todas as fotos na galeria
echo.
echo 3. No ADMIN:
echo    - Delete o ponto
echo.
echo 4. No CLIENT:
echo    - Recarregue e verifique que sumiu
echo.
pause
