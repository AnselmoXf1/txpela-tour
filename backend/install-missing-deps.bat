@echo off
echo ========================================
echo   Instalando Dependencias Faltantes
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

echo Instalando cloudinary...
pip install cloudinary

echo.
echo Instalando google-generativeai...
pip install google-generativeai

echo.
echo ========================================
echo   Instalacao Concluida!
echo ========================================
echo.
echo Agora voce pode iniciar o servidor
pause
