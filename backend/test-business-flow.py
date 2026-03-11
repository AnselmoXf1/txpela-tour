import requests
import json

BASE_URL = "http://localhost:8000/api"

print("="*60)
print("TESTE COMPLETO - BUSINESS FLOW")
print("="*60)

# Dados de teste
test_data = {
    "name": "Restaurante Txopela",
    "email": "txopela@test.com",
    "password": "senha123",
    "category": "restaurant",
    "phone": "+244 923 456 789",
    "description": "Melhor restaurante de Luanda"
}

# 1. CADASTRO
print("\n1. TESTANDO CADASTRO...")
print("-"*60)
print("Dados:", json.dumps(test_data, indent=2))

try:
    response = requests.post(f"{BASE_URL}/business/register/", json=test_data)
    print(f"\nStatus: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        print("✅ CADASTRO OK")
        business_id = response.json().get('business_id')
    elif response.status_code == 400:
        print("⚠️  Possível duplicata ou erro de validação")
        print("Tentando login mesmo assim...")
    else:
        print("❌ ERRO NO CADASTRO")
except Exception as e:
    print(f"❌ Erro: {e}")

# 2. LOGIN
print("\n2. TESTANDO LOGIN...")
print("-"*60)
login_data = {
    "email": test_data["email"],
    "password": test_data["password"]
}
print("Dados:", json.dumps(login_data, indent=2))

try:
    response = requests.post(f"{BASE_URL}/business/login/", json=login_data)
    print(f"\nStatus: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✅ LOGIN OK")
        data = response.json()
        token = data.get('token')
        business = data.get('business')
        print(f"\nToken: {token[:50]}...")
        print(f"Business: {business.get('name')}")
        
        # 3. TESTAR PERFIL
        print("\n3. TESTANDO ACESSO AO PERFIL...")
        print("-"*60)
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/business/profile/", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ PERFIL OK")
            print(f"Response: {response.text}")
        else:
            print("❌ ERRO AO ACESSAR PERFIL")
    else:
        print("❌ ERRO NO LOGIN")
        print("Verifique se o usuário foi criado corretamente")
except Exception as e:
    print(f"❌ Erro: {e}")

print("\n" + "="*60)
print("TESTE CONCLUÍDO")
print("="*60)
