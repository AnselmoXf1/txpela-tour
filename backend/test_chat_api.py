import requests
import json

# URL da API de chat
url = "http://localhost:8000/api/ai/chat/"

# Mensagem de teste
data = {
    "message": "Olá, quais são os melhores pontos turísticos em Inhambane?"
}

print("=" * 50)
print("TESTE DA API DE CHAT (ASSISTENTE TXOPELA)")
print("=" * 50)
print(f"URL: {url}")
print(f"Mensagem: {data['message']}")
print()

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Resposta recebida:")
        print(f"📝 {result.get('response', 'Sem resposta')}")
        
        if 'error' in result:
            print(f"\n⚠️ Erro na resposta: {result['error']}")
    else:
        print(f"❌ Erro HTTP: {response.status_code}")
        print(f"Resposta: {response.text}")
        
except Exception as e:
    print(f"❌ Erro na requisição: {type(e).__name__}")
    print(f"Mensagem: {str(e)}")

print("\n" + "=" * 50)
print("TESTE CONCLUÍDO")