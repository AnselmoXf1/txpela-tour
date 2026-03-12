#!/usr/bin/env python3
# Teste direto do serviço Gemini

import os
import sys
import django

# Configurar Django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'txopela.settings')
django.setup()

print("=" * 50)
print("TESTE DIRETO DO SERVIÇO GEMINI")
print("=" * 50)

# Testar importação do serviço
try:
    from ai_service.services import gemini_service
    print("✅ Serviço Gemini importado com sucesso")
    
    # Verificar se o modelo está disponível
    if gemini_service.model is None:
        print("❌ Modelo Gemini não está disponível")
        print("📋 Verificando dependências...")
        
        # Verificar se google-generativeai está instalado
        try:
            import google.generativeai as genai
            print("✅ google-generativeai está instalado")
            
            # Verificar chave da API
            from django.conf import settings
            api_key = settings.GEMINI_API_KEY
            if api_key:
                print(f"✅ Chave da API encontrada: {api_key[:10]}...{api_key[-10:]}")
                
                # Testar configuração
                try:
                    genai.configure(api_key=api_key)
                    print("✅ API configurada com sucesso")
                    
                    # Listar modelos
                    models = genai.list_models()
                    available_models = []
                    for model in models:
                        if 'generateContent' in model.supported_generation_methods:
                            available_models.append(model.name)
                    
                    print(f"📋 Modelos disponíveis ({len(available_models)}):")
                    for model in available_models[:5]:
                        print(f"  - {model}")
                    
                    # Verificar se o modelo específico está disponível
                    target_model = 'models/gemini-2.0-flash'
                    model_found = any(target_model in m for m in available_models)
                    if model_found:
                        print(f"✅ Modelo {target_model} encontrado")
                    else:
                        print(f"❌ Modelo {target_model} não encontrado")
                        print("📋 Modelos disponíveis com 'gemini':")
                        gemini_models = [m for m in available_models if 'gemini' in m.lower()]
                        for model in gemini_models[:10]:
                            print(f"  - {model}")
                        
                except Exception as e:
                    print(f"❌ Erro ao configurar API: {e}")
            else:
                print("❌ Chave da API não configurada")
                print("📋 Verifique o arquivo .env ou settings.py")
                
        except ImportError:
            print("❌ google-generativeai não está instalado")
            print("💡 Instale com: pip install google-generativeai")
            
    else:
        print("✅ Modelo Gemini está disponível")
        
        # Testar o chat
        print("\n" + "=" * 50)
        print("TESTE DE CHAT DIRETO")
        print("=" * 50)
        
        try:
            response = gemini_service.chat("Olá, teste da assistente")
            print(f"✅ Resposta recebida: {response}")
        except Exception as e:
            print(f"❌ Erro no chat: {type(e).__name__}: {e}")
            
            # Verificar se há problema com MongoDB
            print("\n📋 Verificando conexão com MongoDB...")
            try:
                from pontos_turisticos.mongodb import mongodb
                print("✅ Cliente MongoDB importado")
                
                # Testar conexão
                try:
                    db = mongodb.get_database()
                    print(f"✅ Conectado ao MongoDB: {db.name}")
                    
                    # Verificar coleção de pontos turísticos
                    collection = mongodb.get_collection('pontos_turisticos')
                    count = collection.count_documents({})
                    print(f"✅ Coleção 'pontos_turisticos' encontrada: {count} documentos")
                    
                except Exception as e:
                    print(f"❌ Erro na conexão MongoDB: {e}")
                    
            except ImportError:
                print("❌ Não foi possível importar mongodb")
                
except ImportError as e:
    print(f"❌ Erro ao importar serviço: {e}")
    print("📋 Verifique se o módulo ai_service existe")
    
except Exception as e:
    print(f"❌ Erro inesperado: {type(e).__name__}: {e}")

print("\n" + "=" * 50)
print("TESTE CONCLUÍDO")
print("=" * 50)