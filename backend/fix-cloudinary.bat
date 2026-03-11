@echo off
echo ========================================
echo   Corrigindo Instalacao do Cloudinary
echo ========================================
echo.

cd /d "%~dp0"

echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo Desinstalando cloudinary (se existir)...
pip uninstall -y cloudinary

echo.
echo Instalando cloudinary novamente...
pip install cloudinary

echo.
echo Verificando instalacao...
python -c "import cloudinary; print('✅ Cloudinary instalado com sucesso!')"

echo.
echo ========================================
echo   Concluido!
echo ========================================
echo.
echo Agora execute: start-backend.bat
pause
