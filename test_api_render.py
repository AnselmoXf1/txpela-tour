#!/usr/bin/env python3
"""
Script para testar a API no Render
"""

import requests
import json

# URL da API no Render
BASE_URL = "https://txopela-api.onrender.com"
API_URL = f"{BASE_URL}/api"
# Para testar localmente, use:
# BASE_URL = "http://localhost:8000"
# API_URL = f"{BASE_URL}/api"

def test_root():
    """Testa o endpoint raiz"""
    print("🔍 Testando endpoint raiz (/)...")
    try:
        response = requests.get(BASE_URL, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Endpoint raiz funcionando!")
            print(f"📝 Status: {data.get('status')}")
            print(f"📝 Endpoints disponíveis: {list(data.get('endpoints', {}).keys())}")
            return True
        else:
            print(f"❌ Raiz retornou status {response.status_code}")
            print(f"📝 Resposta: {response.text[:200]}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro ao conectar: {e}")
        return False

def test_health():
    """Testa se a API está online"""
    print("\n🔍 Testando saúde da API...")
    try:
        response = requests.get(f"{API_URL}/ai/health/", timeout=10)
        if response.status_code == 200:
            print("✅ API está online!")
            return True
        else:
            print(f"❌ API retornou status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro ao conectar: {e}")
        return False

def test_chat():
    """Testa o endpoint de chat"""
    print("\n🔍 Testando endpoint de chat...")
    try:
        payload = {
            "messages": [
                {"content": "Olá, me fale sobre Moçambique"}
            ]
        }
        response = requests.post(
            f"{API_URL}/ai/chat/",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Chat funcionando!")
            print(f"📝 Resposta: {data.get('response', 'N/A')[:100]}...")
            return True
        else:
            print(f"❌ Chat retornou status {response.status_code}")
            print(f"📝 Resposta: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro ao testar chat: {e}")
        return False

def test_pontos():
    """Testa o endpoint de pontos turísticos"""
    print("\n🔍 Testando endpoint de pontos turísticos...")
    try:
        response = requests.get(f"{API_URL}/pontos-turisticos/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Pontos turísticos funcionando!")
            print(f"📊 Total de pontos: {len(data)}")
            if len(data) > 0:
                print(f"📝 Exemplo: {data[0].get('nome', 'N/A')}")
            return True
        else:
            print(f"❌ Pontos retornou status {response.status_code}")
            print(f"📝 Resposta: {response.text[:200]}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro ao testar pontos: {e}")
        return False

def test_cors():
    """Testa configuração de CORS"""
    print("\n🔍 Testando CORS...")
    try:
        headers = {
            "Origin": "https://txopela-tour.vercel.app",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type"
        }
        response = requests.options(f"{API_URL}/ai/chat/", headers=headers, timeout=10)
        
        if "access-control-allow-origin" in response.headers:
            print("✅ CORS configurado corretamente!")
            print(f"📝 Allowed Origin: {response.headers.get('access-control-allow-origin')}")
            return True
        else:
            print("⚠️  CORS pode não estar configurado")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro ao testar CORS: {e}")
        return False

def main():
    print("=" * 50)
    print("🚀 TESTE DA API TXOPELA TOUR")
    print("=" * 50)
    print(f"📍 URL: {API_URL}")
    print()
    
    results = {
        "root": test_root(),
        "health": test_health(),
        "pontos": test_pontos(),
        "chat": test_chat(),
        "cors": test_cors()
    }
    
    print("\n" + "=" * 50)
    print("📊 RESUMO DOS TESTES")
    print("=" * 50)
    
    for test_name, result in results.items():
        status = "✅ PASSOU" if result else "❌ FALHOU"
        print(f"{test_name.upper()}: {status}")
    
    total = sum(results.values())
    print(f"\n🎯 Total: {total}/{len(results)} testes passaram")
    
    if total == len(results):
        print("\n🎉 Todos os testes passaram! API está funcionando perfeitamente!")
    else:
        print("\n⚠️  Alguns testes falharam. Verifique a configuração.")

if __name__ == "__main__":
    main()
