@echo off
echo ========================================
echo   Populando Banco de Dados MongoDB
echo ========================================
echo.

cd /d "%~dp0"

if not exist "venv\Scripts\activate.bat" (
    echo [ERRO] Ambiente virtual nao encontrado!
    echo Execute install-dependencies.bat primeiro
    pause
    exit /b 1
)

call venv\Scripts\activate.bat

echo Executando script de seed...
python seed_pontos.py

echo.
echo ========================================
echo   Concluido!
echo ========================================
pause
