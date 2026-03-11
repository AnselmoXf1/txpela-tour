@echo off
echo ========================================
echo Limpando projeto Txopela Tour MVP
echo ========================================
echo.

cd ..

echo [1/3] Removendo pasta antiga txopela-tour-main...
if exist "txopela-tour-main" (
    rmdir /s /q "txopela-tour-main"
    echo ✓ Pasta txopela-tour-main removida
) else (
    echo - Pasta txopela-tour-main não encontrada
)
echo.

cd txopela-tour-mvp

echo [2/3] Removendo frontend Next.js...
if exist "frontend" (
    rmdir /s /q "frontend"
    echo ✓ Frontend Next.js removido
) else (
    echo - Frontend Next.js não encontrado
)
echo.

echo [3/3] Renomeando frontend-vite para frontend...
if exist "frontend-vite" (
    rename "frontend-vite" "frontend"
    echo ✓ Frontend renomeado com sucesso
) else (
    echo - frontend-vite não encontrado
)
echo.

echo ========================================
echo Limpeza concluída!
echo ========================================
echo.
echo Estrutura final:
echo   txopela-tour-mvp/
echo   ├── backend/    (Django + MongoDB + Gemini AI)
echo   └── frontend/   (Vite + React)
echo.
echo Próximos passos:
echo   1. Configure o backend (veja SETUP.md)
echo   2. Configure o frontend (veja SETUP.md)
echo.
pause
