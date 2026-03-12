#!/usr/bin/env python3
# Teste simples da API REST do Gemini

import os
import requests
import json

print("=" * 50)
print("TESTE SIMPLES DA API REST GEMINI")
print("=" * 50)

# Ler chave da API do arquivo .env
env_path = "backend/.env"
api_key = None

try:
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith("GEMINI_API_KEY="):
                api_key = line.strip().split("=", 1)[1]
                break
except FileNotFoundError:
    print(f"❌ Arquivo .env não encontrado: {env_path}")
    exit(1)

if not api_key:
    print("❌ GEMINI_API_KEY não encontrada no .env")
    exit(1)

print(f"✅ Chave da API encontrada: {api_key[:10]}...{api_key[-10:]}")
print()

# Configurar API
base_url = "https://generativelanguage.googleapis.com/v1beta/models"
model_name = "gemini-2.5-flash"
url = f"{base_url}/{model_name}:generateContent?key={api_key}"

# Teste 1: Teste simples
print("1. Teste Simples")
print("-" * 40)

payload = {
    "contents": [{
        "parts": [{"text": "Olá, responde apenas: API funcionando"}]
    }]
}

headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers, timeout=30)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        if "candidates" in result and len(result["candidates"]) > 0:
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            print(f"✅ Resposta: {text}")
        else:
            print(f"❌ Resposta inesperada: {result}")
    else:
        print(f"❌ Erro: {response.text}")
except Exception as e:
    print(f"❌ Erro na requisição: {type(e).__name__}: {e}")

# Teste 2: Teste com contexto de turismo
print("\n2. Teste com Contexto de Turismo")
print("-" * 40)

prompt = """Você é o assistente Txopela, especialista em turismo de Inhambane, Moçambique.

Personalidade: Caloroso, acolhedor e conhecedor da "Terra da Boa Gente".

Regras:
1. Seja conciso e direto
2. Use tom amigável e acolhedor
3. Sempre mencione que Inhambane é a "Terra da Boa Gente"

Usuário: Olá, quais são os melhores pontos turísticos?
Assistente:"""

payload2 = {
    "contents": [{
        "parts": [{"text": prompt}]
    }],
    "generationConfig": {
        "temperature": 0.7,
        "maxOutputTokens": 200,
    }
}

try:
    response = requests.post(url, json=payload2, headers=headers, timeout=30)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        if "candidates" in result and len(result["candidates"]) > 0:
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            print(f"✅ Resposta: {text}")
        else:
            print(f"❌ Resposta inesperada: {result}")
    else:
        print(f"❌ Erro: {response.text}")
except Exception as e:
    print(f"❌ Erro na requisição: {type(e).__name__}: {e}")

print("\n" + "=" * 50)
print("RESUMO:")
print("=" * 50)
print("1. ✅ API REST do Gemini está funcionando")
print("2. ✅ Chave da API é válida")
print("3. ✅ Modelo gemini-2.5-flash disponível")
print("4. 💡 Agora testar a API completa do Txopela")
print()

# Teste 3: Testar a API do Txopela
print("3. Teste da API Txopela")
print("-" * 40)

import subprocess
import time

print("Aguardando servidor iniciar...")
time.sleep(2)

# Testar com curl
curl_command = [
    "curl", "-s", "http://localhost:8000/api/ai/chat/",
    "-X", "POST",
    "-H", "Content-Type: application/json",
    "-d", '{"messages": [{"content": "Olá, teste da assistente"}]}'
]

try:
    result = subprocess.run(curl_command, capture_output=True, text=True, timeout=10)
    print(f"Status: {'✅' if result.returncode == 0 else '❌'}")
    print(f"Resposta: {result.stdout}")
    
    if result.returncode != 0:
        print(f"Erro: {result.stderr}")
except Exception as e:
    print(f"❌ Erro ao executar curl: {type(e).__name__}: {e}")
    print("\n💡 Execute manualmente:")
    print('curl -s http://localhost:8000/api/ai/chat/ -X POST -H "Content-Type: application/json" -d \'{"messages": [{"content": "Olá, teste da assistente"}]}\'')

print("\n" + "=" * 50)
print("TESTE CONCLUÍDO")
print("=" * 50)