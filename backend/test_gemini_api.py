import os
import google.generativeai as genai
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configurar a chave da API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyBeusp4cuMC709uuQ1ZfpQzdK4sdp6GP2Y')

print("=" * 50)
print("TESTE DA API GEMINI")
print("=" * 50)
print(f"Chave API: {GEMINI_API_KEY[:10]}...{GEMINI_API_KEY[-10:]}")
print()

try:
    # Configurar a API
    genai.configure(api_key=GEMINI_API_KEY)
    
    # Listar modelos disponíveis
    print("Listando modelos disponíveis...")
    models = genai.list_models()
    
    available_models = []
    for model in models:
        if 'generateContent' in model.supported_generation_methods:
            available_models.append(model.name)
    
    print(f"✅ API configurada com sucesso!")
    print(f"📋 Modelos disponíveis para geração de conteúdo:")
    for model in available_models[:5]:  # Mostrar apenas os primeiros 5
        print(f"  - {model}")
    
    if available_models:
        # Testar com um modelo específico
        print("\n" + "=" * 50)
        print("TESTE DE GERAÇÃO DE CONTEÚDO")
        print("=" * 50)
        
        # Usar o modelo Gemini 2.0 Flash (disponível na lista)
        model_name = "models/gemini-2.0-flash"
        
        # Verificar se o modelo está disponível
        model_found = False
        actual_model_name = ""
        for available_model in available_models:
            if model_name in available_model:
                model_found = True
                actual_model_name = available_model
                break
        
        if model_found:
            model = genai.GenerativeModel(actual_model_name)
            
            # Fazer uma pergunta simples
            prompt = "Explique em uma frase o que é inteligência artificial."
            
            print(f"Modelo: {actual_model_name}")
            print(f"Prompt: {prompt}")
            print("Gerando resposta...")
            
            response = model.generate_content(prompt)
            
            print(f"\n✅ Resposta recebida:")
            print(f"📝 {response.text}")
            
            # Verificar tokens usados
            if hasattr(response, 'usage_metadata'):
                print(f"\n📊 Uso de tokens:")
                print(f"  Prompt tokens: {response.usage_metadata.prompt_token_count}")
                print(f"  Candidates tokens: {response.usage_metadata.candidates_token_count}")
                print(f"  Total tokens: {response.usage_metadata.total_token_count}")
            else:
                # Tentar obter informações de uso de forma alternativa
                print(f"\n📊 Informações da resposta:")
                print(f"  Modelo usado: {actual_model_name}")
                print(f"  Resposta gerada com sucesso!")
        else:
            print(f"⚠️ Modelo {model_name} não encontrado.")
            print(f"📋 Modelos disponíveis:")
            for model in available_models[:10]:  # Mostrar até 10 modelos
                print(f"  - {model}")
    
    print("\n" + "=" * 50)
    print("✅ TESTE CONCLUÍDO COM SUCESSO!")
    print("A API Gemini está funcionando corretamente.")
    
except Exception as e:
    print(f"\n❌ ERRO AO TESTAR API GEMINI:")
    print(f"Tipo de erro: {type(e).__name__}")
    print(f"Mensagem: {str(e)}")
    
    # Dicas de solução de problemas
    print("\n🔧 DICAS PARA SOLUÇÃO:")
    print("1. Verifique se a chave da API está correta")
    print("2. Verifique se a chave tem permissões para a API Gemini")
    print("3. Verifique sua conexão com a internet")
    print("4. Verifique se há limites de cota na sua conta Google")
    
    if "API_KEY_INVALID" in str(e):
        print("\n⚠️ A chave da API parece estar inválida.")
        print("   Obtenha uma nova chave em: https://makersuite.google.com/app/apikey")
    elif "quota" in str(e).lower():
        print("\n⚠️ Pode ter excedido a cota da API.")
        print("   Verifique seu uso em: https://console.cloud.google.com/apis/dashboard")
    elif "network" in str(e).lower() or "connection" in str(e).lower():
        print("\n⚠️ Problema de conexão de rede.")
        print("   Verifique sua conexão com a internet.")