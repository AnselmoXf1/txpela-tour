"""
Script para listar modelos disponíveis do Gemini
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure a API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

print("=" * 60)
print("Modelos Gemini Disponíveis")
print("=" * 60)
print()

# Lista todos os modelos
for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"✅ {model.name}")
        print(f"   Display Name: {model.display_name}")
        print(f"   Description: {model.description}")
        print(f"   Supported Methods: {', '.join(model.supported_generation_methods)}")
        print()

print("=" * 60)
print("Use um dos nomes acima no código (ex: 'models/gemini-pro')")
print("=" * 60)
