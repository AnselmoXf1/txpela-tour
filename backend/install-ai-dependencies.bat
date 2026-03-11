@echo off
echo ========================================
echo   Instalando Dependencias de IA
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

echo Instalando google-generativeai...
pip install google-generativeai

echo.
echo ========================================
echo   Instalacao Concluida!
echo ========================================
echo.
echo Agora voce pode usar o chatbot com IA
pause
