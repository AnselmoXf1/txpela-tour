@echo off
echo ========================================
echo TESTE DA API NO RENDER
echo ========================================
echo.

echo Testando endpoint raiz...
curl -s https://txopela-api.onrender.com/ | python -m json.tool
echo.
echo.

echo ========================================
echo Executando testes completos...
echo ========================================
python test_api_render.py

echo.
echo ========================================
echo TESTE CONCLUIDO
echo ========================================
pause
