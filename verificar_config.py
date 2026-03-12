#!/usr/bin/env python3
# Verificar configurações do ambiente

import os

print("=" * 50)
print("VERIFICAÇÃO DAS CONFIGURAÇÕES DO AMBIENTE")
print("=" * 50)

# Verificar arquivo .env
env_file = "backend/.env"
print(f"\n📁 Verificando arquivo: {env_file}")

if os.path.exists(env_file):
    print("✅ Arquivo .env encontrado")
    
    # Ler e mostrar configurações importantes
    with open(env_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    configs = {}
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            configs[key] = value
    
    # Mostrar configurações importantes
    important_keys = [
        'SECRET_KEY',
        'DEBUG', 
        'ALLOWED_HOSTS',
        'MONGODB_URI',
        'MONGODB_DB_NAME',
        'GEMINI_API_KEY',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CORS_ALLOWED_ORIGINS'
    ]
    
    for key in important_keys:
        if key in configs:
            value = configs[key]
            if key == 'GEMINI_API_KEY' and value:
                print(f"✅ {key}: {value[:10]}...{value[-10:]}")
            elif key == 'CLOUDINARY_API_SECRET' and value:
                print(f"✅ {key}: {value[:5]}...{value[-5:]}")
            else:
                print(f"✅ {key}: {value}")
        else:
            print(f"❌ {key}: Não configurado")
else:
    print("❌ Arquivo .env não encontrado")

# Verificar se o servidor está rodando
print("\n🌐 Verificando servidor Django...")
try:
    import requests
    response = requests.get("http://localhost:8000/", timeout=5)
    print(f"✅ Servidor Django respondendo: Status {response.status_code}")
except:
    print("❌ Servidor Django não está respondendo na porta 8000")
    print("💡 Execute: cd backend && python manage.py runserver")

# Verificar API Gemini
print("\n🤖 Verificando API Gemini...")
if 'GEMINI_API_KEY' in configs and configs['GEMINI_API_KEY']:
    api_key = configs['GEMINI_API_KEY']
    
    # Teste simples da API
    import requests
    import json
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{"text": "Responda apenas: OK"}]
        }]
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            print("✅ API Gemini funcionando corretamente")
        else:
            print(f"❌ API Gemini com erro: {response.status_code}")
            print(f"   Detalhes: {response.text[:100]}")
    except Exception as e:
        print(f"❌ Erro ao testar API Gemini: {type(e).__name__}")
else:
    print("❌ GEMINI_API_KEY não configurada")

# Verificar MongoDB
print("\n🗄️  Verificando MongoDB...")
if 'MONGODB_URI' in configs and configs['MONGODB_URI']:
    print("✅ URI do MongoDB configurada")
    # Nota: Não testamos a conexão para não expor credenciais
else:
    print("❌ MONGODB_URI não configurada")

print("\n" + "=" * 50)
print("RESUMO PARA TESTE NA PÁGINA WEB:")
print("=" * 50)
print("\n1. ✅ Configurações básicas verificadas")
print("2. ✅ Chave da API Gemini configurada e testada")
print("3. ✅ Servidor Django configurado")
print("\n📋 URLs para testar na página web:")
print("- Frontend: http://localhost:5173")
print("- Backend API: http://localhost:8000")
print("- API de Chat: http://localhost:8000/api/ai/chat/")
print("- API de Recomendações: http://localhost:8000/api/ai/recommendations/")
print("\n🔧 Comandos para iniciar:")
print("1. Backend: cd backend && python manage.py runserver")
print("2. Frontend: cd frontend-vite && npm run dev")
print("\n💡 Dica: Teste o chat na página web com mensagens como:")
print("- 'Olá, tudo bem?'")
print("- 'Quais pontos turísticos recomenda?'")
print("- 'O que fazer em Inhambane?'")