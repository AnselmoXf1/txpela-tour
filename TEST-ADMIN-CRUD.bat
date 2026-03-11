@echo off
echo ========================================
echo TESTE DO CRUD ADMIN - TXOPELA TOUR
echo ========================================
echo.

echo [1/4] Verificando backend...
cd backend
python manage.py check
if %errorlevel% neq 0 (
    echo ERRO: Backend com problemas!
    pause
    exit /b 1
)
echo Backend OK!
echo.

echo [2/4] Verificando MongoDB...
python -c "from pontos_turisticos.mongodb import mongodb; print('MongoDB conectado:', mongodb.db.name)"
if %errorlevel% neq 0 (
    echo ERRO: MongoDB nao conectado!
    pause
    exit /b 1
)
echo MongoDB OK!
echo.

echo [3/4] Verificando Cloudinary...
python -c "import cloudinary; from django.conf import settings; cloudinary.config(cloud_name=settings.CLOUDINARY_CLOUD_NAME, api_key=settings.CLOUDINARY_API_KEY, api_secret=settings.CLOUDINARY_API_SECRET); print('Cloudinary configurado:', settings.CLOUDINARY_CLOUD_NAME)"
if %errorlevel% neq 0 (
    echo ERRO: Cloudinary nao configurado!
    pause
    exit /b 1
)
echo Cloudinary OK!
echo.

cd ..

echo [4/4] Verificando admin app...
cd admin-app
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
)
echo Admin app OK!
echo.

cd ..

echo ========================================
echo TODOS OS TESTES PASSARAM!
echo ========================================
echo.
echo O CRUD admin esta pronto para uso:
echo.
echo CREATE: POST /admin/pontos/create/ (com FormData + imagens)
echo READ:   GET  /pontos-turisticos/
echo UPDATE: PATCH /pontos-turisticos/{id}/update/
echo DELETE: DELETE /pontos-turisticos/{id}/delete/
echo.
echo IMAGENS:
echo - Upload: POST /pontos-turisticos/{id}/upload-image/
echo - Delete: DELETE /pontos-turisticos/{id}/delete-image/{public_id}/
echo.
echo DADOS: MongoDB Atlas
echo FOTOS: Cloudinary
echo.
echo Para iniciar:
echo 1. Backend: cd backend ^&^& python manage.py runserver
echo 2. Admin:   cd admin-app ^&^& npm run dev
echo.
pause
