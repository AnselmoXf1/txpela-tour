#!/usr/bin/env python3
"""
Script para testar a API no Render
"""

import requests
import json

# URL da API (altere quando tiver a URL do Render)
API_URL = "https://txopela-api.onrender.com/api"
# Para testar localmente, use:
# API_URL = "http://localhost:8000/api"

def test_health():
    """Testa se a API está online"""
    print("🔍 Testando saúde da API...")
    try:
        response = requests.get(f"{API_URL}/health/", timeout=10)
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
        response = requests.get(f"{API_URL}/pontos/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Pontos turísticos funcionando!")
            print(f"📊 Total de pontos: {len(data)}")
            return True
        else:
            print(f"❌ Pontos retornou status {response.status_code}")
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
        "health": test_health(),
        "chat": test_chat(),
        "pontos": test_pontos(),
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
