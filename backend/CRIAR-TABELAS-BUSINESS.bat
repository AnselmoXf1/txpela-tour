@echo off
echo ========================================
echo   CRIAR TABELAS DO BUSINESS PANEL
echo ========================================
echo.

call venv\Scripts\activate

echo Criando migrações...
python manage.py makemigrations business_panel

echo.
echo Aplicando migrações...
python manage.py migrate

echo.
echo ========================================
echo   TABELAS CRIADAS COM SUCESSO!
echo ========================================
echo.
echo Agora você pode:
echo 1. Iniciar o servidor: python manage.py runserver
echo 2. Cadastrar negócios no Business App
echo.
pause
