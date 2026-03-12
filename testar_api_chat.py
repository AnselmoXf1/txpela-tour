#!/usr/bin/env python3
# Testar a API de chat do Txopela

import requests
import json
import time

print("=" * 50)
print("TESTE DA API DE CHAT TXOPELA")
print("=" * 50)

# URL da API
url = "http://localhost:8000/api/ai/chat/"

# Mensagens de teste
test_messages = [
    {"messages": [{"content": "Olá, tudo bem?"}]},
    {"messages": [{"content": "Quais são os melhores pontos turísticos em Inhambane?"}]},
    {"messages": [{"content": "Recomende lugares para visitar"}]},
    {"messages": [{"content": "O que fazer em Inhambane?"}]}
]

print("⚠️  Certifique-se de que o servidor Django está rodando!")
print("💡 Execute: cd backend && python manage.py runserver")
print()

for i, data in enumerate(test_messages, 1):
    print(f"\n📋 Teste {i}: {data['messages'][0]['content']}")
    print("-" * 40)
    
    try:
        response = requests.post(url, json=data, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if 'response' in result:
                print(f"✅ Resposta: {result['response'][:150]}...")
            elif 'error' in result:
                print(f"❌ Erro: {result['error']}")
            else:
                print(f"❌ Resposta inesperada: {result}")
        else:
            print(f"❌ Erro HTTP: {response.text[:100]}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Não foi possível conectar ao servidor")
        print("💡 Verifique se o servidor está rodando: python manage.py runserver")
        break
    except Exception as e:
        print(f"❌ Erro: {type(e).__name__}: {e}")
    
    # Pequena pausa entre requisições
    time.sleep(1)

print("\n" + "=" * 50)
print("INSTRUÇÕES PARA TESTAR NA PÁGINA WEB:")
print("=" * 50)
print("\n1. Inicie o servidor backend:")
print("   cd backend")
print("   python manage.py runserver")
print("\n2. Inicie o frontend (se necessário):")
print("   cd frontend-vite")
print("   npm run dev")
print("\n3. Acesse no navegador:")
print("   http://localhost:5173")
print("\n4. Teste o chat na interface web")
print("\n5. Se encontrar erros, verifique:")
print("   - Console do navegador (F12)")
print("   - Terminal do servidor Django")
print("   - Arquivos de log")