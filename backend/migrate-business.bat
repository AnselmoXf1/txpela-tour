@echo off
echo Criando migrações para business_panel...
call venv\Scripts\activate
python manage.py makemigrations business_panel
echo.
echo Aplicando migrações...
python manage.py migrate
echo.
echo Concluído!
pause
