@echo off
echo ========================================
echo   SETUP COMPLETO - TXOPELA TOUR
echo ========================================
echo.
echo Este script vai configurar tudo automaticamente:
echo 1. Instalar dependencias do backend
echo 2. Popular banco de dados
echo 3. Criar usuario admin
echo.
pause

cd backend

echo.
echo ========================================
echo [1/4] Instalando dependencias Python...
echo ========================================
call install-dependencies.bat

echo.
echo ========================================
echo [2/4] Instalando Cloudinary e IA...
echo ========================================
call install-missing-deps.bat

echo.
echo ========================================
echo [3/4] Populando banco de dados...
echo ========================================
call seed-database.bat

echo.
echo ========================================
echo [4/4] Criando usuario admin...
echo ========================================
call create-admin.bat

cd ..

echo.
echo ========================================
echo   SETUP CONCLUIDO!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Abra um terminal e execute:
echo    cd txopela-tour-mvp/backend
echo    start-backend.bat
echo.
echo 2. Abra OUTRO terminal e execute:
echo    cd txopela-tour-mvp/frontend-vite
echo    npm install
echo    npm run dev
echo.
echo 3. Acesse: http://localhost:5173
echo.
echo 4. Login admin:
echo    Username: admin
echo    Password: admin123
echo.
pause
