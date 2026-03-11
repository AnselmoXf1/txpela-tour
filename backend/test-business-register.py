import requests
import json

url = "http://localhost:8000/api/business/register/"

data = {
    "name": "Restaurante Teste",
    "email": "teste@restaurante.com",
    "password": "senha123",
    "category": "restaurant",
    "phone": "+244 923 456 789",
    "description": "Melhor restaurante da cidade"
}

print("Enviando dados:")
print(json.dumps(data, indent=2))
print("\n" + "="*50 + "\n")

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        print("\n✅ SUCESSO! Negócio cadastrado.")
    else:
        print("\n❌ ERRO! Veja detalhes acima.")
        
except Exception as e:
    print(f"❌ Erro na requisição: {e}")
