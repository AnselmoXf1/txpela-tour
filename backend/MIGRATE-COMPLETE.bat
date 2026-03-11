@echo off
echo ========================================
echo   MIGRAÇÃO COMPLETA - PLATAFORMA TXOPELA
echo ========================================
echo.

call venv\Scripts\activate

echo 1. Criando migrações para business_panel...
python manage.py makemigrations business_panel

echo.
echo 2. Aplicando migrações...
python manage.py migrate

echo.
echo 3. Criando superusuário (opcional)...
echo Se quiser criar um superusuário, digite:
echo   python manage.py createsuperuser
echo.

echo ========================================
echo   MIGRAÇÃO CONCLUÍDA!
echo ========================================
echo.
echo Agora você pode:
echo 1. Iniciar o servidor: python manage.py runserver
echo 2. Testar a API em: http://localhost:8000/api/
echo 3. Acessar o admin: http://localhost:8000/admin/
echo.
pause