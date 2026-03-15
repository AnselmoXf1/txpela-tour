#!/usr/bin/env python3
"""
Script para testar a API no Render
"""
import requests
import json

# URL da API no Render (substitua pela sua URL real)
BASE_URL = "https://txopela-api.onrender.com"

def test_endpoint(name, url, method="GET", data=None):
    """Testa um endpoint específico"""
    print(f"\n{'='*60}")
    print(f"Testando: {name}")
    print(f"URL: {url}")
    print(f"Método: {method}")
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=30)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=30)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Sucesso!")
            try:
                print(f"Resposta: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
            except:
                print(f"Resposta (texto): {response.text[:200]}")
        else:
            print(f"❌ Erro: {response.status_code}")
            print(f"Resposta: {response.text[:500]}")
            
    except requests.exceptions.Timeout:
        print("❌ Timeout - O servidor demorou muito para responder")
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão - Não foi possível conectar ao servidor")
    except Exception as e:
        print(f"❌ Erro: {str(e)}")

def main():
    print("="*60)
    print("TESTE DA API TXOPELA NO RENDER")
    print("="*60)
    
    # Teste 1: Endpoint raiz
    test_endpoint(
        "Endpoint Raiz",
        f"{BASE_URL}/"
    )
    
    # Teste 2: Pontos turísticos
    test_endpoint(
        "Listar Pontos Turísticos",
        f"{BASE_URL}/api/pontos-turisticos/"
    )
    
    # Teste 3: Categorias
    test_endpoint(
        "Listar Categorias",
        f"{BASE_URL}/api/pontos-turisticos/categorias/"
    )
    
    # Teste 4: Health check do AI
    test_endpoint(
        "AI Service Health",
        f"{BASE_URL}/api/ai/health/"
    )
    
    # Teste 5: Business endpoints
    test_endpoint(
        "Business Categories",
        f"{BASE_URL}/api/business/categories/"
    )
    
    print("\n" + "="*60)
    print("TESTES CONCLUÍDOS")
    print("="*60)
    print("\nSe tod
ain()
    m":= "__main___ =
if __name_
?")m sucessocluído cocon build foi ("4. O
    printas?")iguradnfestão combiente is de aariáve As v print("3.der?")
   dando no Reno está rorviç"2. O sent(ri?")
    pá correta Render est. A URL do"1  print(
  ue:") verifiq falharam,os os testes