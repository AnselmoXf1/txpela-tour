@echo off
echo ========================================
echo Instalando Dependências - Backend
echo ========================================
echo.

echo [1/2] Atualizando pip...
python.exe -m pip install --upgrade pip
echo.

echo [2/2] Instalando dependências...
echo.

pip install Django==5.0.3
pip install djangorestframework==3.15.1
pip install pymongo==4.6.2
pip install python-dotenv==1.0.1
pip install djangorestframework-simplejwt==5.3.1
pip install django-cors-headers==4.3.1
pip install google-generativeai==0.4.1
pip install cloudinary==1.40.0

echo.
echo ========================================
echo Instalação concluída!
echo ========================================
echo.
pause
