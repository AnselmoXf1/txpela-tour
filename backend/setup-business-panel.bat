@echo off
echo Configurando Business Panel...
echo.

echo Ativando ambiente virtual...
call venv\Scripts\activate

echo.
echo Criando migrações...
python manage.py makemigrations business_panel

echo.
echo Aplicando migrações...
python manage.py migrate

echo.
echo Business Panel configurado com sucesso!
pause
