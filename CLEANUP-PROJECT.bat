@echo off
echo ========================================
echo LIMPEZA DO PROJETO TXOPELA TOUR
echo ========================================
echo.
echo Este script vai remover:
echo - Pasta frontend antiga (Next.js nao usado)
echo - Scripts de teste duplicados
echo - Arquivos temporarios
echo.
echo ATENCAO: Esta acao nao pode ser desfeita!
echo.
pause

echo.
echo [1/5] Removendo pasta frontend antiga (Next.js)...
if exist "frontend" (
    rmdir /s /q "frontend"
    echo Frontend antigo removido!
) else (
    echo Frontend antigo ja foi removido.
)
echo.

echo [2/5] Removendo scripts de teste duplicados...
if exist "CHECK-ECOSYSTEM.bat" del /q "CHECK-ECOSYSTEM.bat"
if exist "CHECKLIST-EDICAO-FOTOS.md" del /q "CHECKLIST-EDICAO-FOTOS.md"
if exist "CLEAR-ADMIN-CACHE.bat" del /q "CLEAR-ADMIN-CACHE.bat"
if exist "CREATE-ADMIN-APP.bat" del /q "CREATE-ADMIN-APP.bat"
if exist "FIX-ADMIN-ERRORS.bat" del /q "FIX-ADMIN-ERRORS.bat"
if exist "FIX-ADMIN-TAILWIND.bat" del /q "FIX-ADMIN-TAILWIND.bat"
if exist "FIX-TAILWIND-V3.bat" del /q "FIX-TAILWIND-V3.bat"
if exist "INSTALL-ADMIN-DEPS.bat" del /q "INSTALL-ADMIN-DEPS.bat"
if exist "QUICK-START-EDICAO-FOTOS.bat" del /q "QUICK-START-EDICAO-FOTOS.bat"
if exist "RENAME-CLIENT-APP-FORCE.bat" del /q "RENAME-CLIENT-APP-FORCE.bat"
if exist "RENAME-CLIENT-APP.bat" del /q "RENAME-CLIENT-APP.bat"
if exist "TEST-EDIT-IMAGES.bat" del /q "TEST-EDIT-IMAGES.bat"
if exist "TEST-IMAGE-UPLOAD.bat" del /q "TEST-IMAGE-UPLOAD.bat"
if exist "TESTE-UPLOAD-IMAGENS.md" del /q "TESTE-UPLOAD-IMAGENS.md"
if exist "EDICAO-FOTOS.md" del /q "EDICAO-FOTOS.md"
echo Scripts duplicados removidos!
echo.

echo [3/5] Removendo arquivos temporarios do backend...
cd backend
if exist "db.sqlite3" del /q "db.sqlite3"
if exist "*.pyc" del /s /q "*.pyc"
if exist "__pycache__" rmdir /s /q "__pycache__"
cd ..
echo Temporarios do backend removidos!
echo.

echo [4/5] Limpando node_modules desnecessarios...
echo (Mantendo apenas admin-app e frontend-vite)
echo Node_modules preservados (use npm install se necessario)
echo.

echo [5/5] Criando estrutura limpa...
echo.
echo Estrutura final:
echo.
echo txopela-tour-mvp/
echo   ├── backend/          (Django + MongoDB + Cloudinary)
echo   ├── admin-app/        (React Admin Panel)
echo   ├── frontend-vite/    (React Client App)
echo   ├── START-ALL.bat     (Inicia tudo)
echo   ├── SETUP-TUDO.bat    (Setup inicial)
echo   └── README.md         (Documentacao)
echo.

echo ========================================
echo LIMPEZA CONCLUIDA!
echo ========================================
echo.
echo Arquivos mantidos (importantes):
echo - START-ALL.bat
echo - SETUP-TUDO.bat
echo - RESTART-BACKEND.bat
echo - START-FRONTEND-VITE.bat
echo - TEST-ADMIN-CRUD.bat
echo - TEST-INTEGRATION.bat
echo - CRUD-ADMIN-STATUS.md
echo - INTEGRACAO-ADMIN-CLIENT.md
echo - README.md
echo.
echo Pastas mantidas:
echo - backend/
echo - admin-app/
echo - frontend-vite/
echo.
echo Removido:
echo - frontend/ (Next.js antigo)
echo - Scripts de teste duplicados
echo - Arquivos temporarios
echo.
pause
