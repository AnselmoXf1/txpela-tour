#!/usr/bin/env python3
# Teste da nova implementação REST do Gemini

import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'txopela_backend.settings')
django.setup()

print("=" * 50)
print("TESTE DA NOVA IMPLEMENTAÇÃO REST GEMINI")
print("=" * 50)

from django.conf import settings

# Verificar chave da API
api_key = settings.GEMINI_API_KEY
print(f"Chave da API: {api_key[:10]}...{api_key[-10:] if api_key else 'Não configurada'}")

# Testar importação do serviço
try:
    from ai_service.services import gemini_service
    print("✅ Serviço Gemini importado com sucesso")
    
    # Testar o chat
    print("\n" + "=" * 50)
    print("TESTE DE CHAT COM API REST")
    print("=" * 50)
    
    test_messages = [
        "Olá, tudo bem?",
        "Quais são os melhores pontos turísticos em Inhambane?",
        "Recomende lugares para visitar"
    ]
    
    for message in test_messages:
        print(f"\n📤 Mensagem: {message}")
        try:
            response = gemini_service.chat(message)
            print(f"📥 Resposta: {response[:100]}..." if len(response) > 100 else f"📥 Resposta: {response}")
        except Exception as e:
            print(f"❌ Erro: {type(e).__name__}: {e}")
    
    # Testar recomendações
    print("\n" + "=" * 50)
    print("TESTE DE RECOMENDAÇÕES")
    print("=" * 50)
    
    preferences = "praia e natureza"
    print(f"📤 Preferências: {preferences}")
    
    try:
        result = gemini_service.get_recommendations(preferences)
        print(f"✅ Explicação: {result['explanation'][:100]}...")
        print(f"✅ Pontos recomendados: {len(result['pontos'])}")
    except Exception as e:
        print(f"❌ Erro: {type(e).__name__}: {e}")
    
except ImportError as e:
    print(f"❌ Erro ao importar serviço: {e}")
except Exception as e:
    print(f"❌ Erro inesperado: {type(e).__name__}: {e}")

print("\n" + "=" * 50)
print("TESTE CONCLUÍDO")
print("=" * 50)