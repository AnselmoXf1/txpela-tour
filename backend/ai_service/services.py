import requests
import json
from django.conf import settings
from pontos_turisticos.mongodb import mongodb

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.model_name = "gemini-2.5-flash"  # Modelo que funcionou no seu teste
        
        if not self.api_key:
            print("⚠️  GEMINI_API_KEY não configurada no .env")
            self.api_key = None
            return
            
        print(f"✅ Serviço Gemini configurado com modelo: {self.model_name}")
        
    def get_context_from_db(self, query: str = None):
        """Busca pontos turísticos relevantes do MongoDB"""
        collection = mongodb.get_collection('pontos_turisticos')
        
        if query:
            try:
                pontos = list(collection.find({'$text': {'$search': query}}).limit(10))
            except:
                # Fallback para regex se índice de texto não existir
                regex_pattern = {'$regex': query, '$options': 'i'}
                pontos = list(collection.find({
                    '$or': [
                        {'nome': regex_pattern},
                        {'descricao': regex_pattern},
                        {'categoria': regex_pattern}
                    ]
                }).limit(10))
        else:
            pontos = list(collection.find().limit(10))
        
        context = "Pontos turísticos disponíveis em Inhambane:\n\n"
        for ponto in pontos:
            context += f"- {ponto['nome']}: {ponto['descricao']}\n"
            context += f"  Categoria: {ponto['categoria']}\n"
            if 'preco_medio' in ponto and ponto['preco_medio']:
                context += f"  Preço médio: {ponto['preco_medio']} MZN\n"
            context += "\n"
        
        return context, pontos
    
    def chat(self, user_message: str, conversation_history: list = None):
        """Processa mensagem do usuário com contexto do banco de dados"""
        if not self.api_key:
            return self._get_fallback_response(user_message)
        
        try:
            context, pontos = self.get_context_from_db(user_message)
            
            system_prompt = """Você é o assistente Txopela, especialista em turismo de Inhambane, Moçambique.
            
Personalidade: Caloroso, acolhedor e conhecedor da "Terra da Boa Gente".
            
Regras:
1. Responda APENAS com base nos dados fornecidos
2. Seja conciso e direto
3. Use tom amigável e acolhedor
4. Recomende pontos turísticos específicos quando relevante
5. Se não tiver informação, seja honesto
6. Sempre mencione que Inhambane é a "Terra da Boa Gente"

Dados disponíveis:
""" + context
            
            # Construir o prompt completo
            full_prompt = system_prompt + "\n\n"
            
            if conversation_history:
                for msg in conversation_history:
                    full_prompt += f"Usuário: {msg}\n"
            
            full_prompt += f"Usuário: {user_message}\nAssistente:"
            
            # Chamar a API REST do Gemini
            url = f"{self.base_url}/{self.model_name}:generateContent?key={self.api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{"text": full_prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                }
            }
            
            headers = {
                "Content-Type": "application/json"
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if "candidates" in result and len(result["candidates"]) > 0:
                    return result["candidates"][0]["content"]["parts"][0]["text"]
                else:
                    print(f"Resposta inesperada da API: {result}")
                    return self._get_fallback_response(user_message)
            else:
                print(f"Erro na API Gemini: {response.status_code} - {response.text}")
                if response.status_code == 429:  # Quota exceeded
                    return self._get_quota_exceeded_response(user_message, pontos)
                return self._get_fallback_response(user_message)
                
        except Exception as e:
            print(f"Erro no chat: {type(e).__name__}: {e}")
            return self._get_fallback_response(user_message)
    
    def _get_quota_exceeded_response(self, user_message: str, pontos: list):
        """Resposta quando a cota da API está excedida"""
        # Analisar a mensagem do usuário para dar uma resposta relevante
        user_message_lower = user_message.lower()
        
        if any(word in user_message_lower for word in ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite']):
            return "Olá! Sou o assistente Txopela. No momento, nosso serviço de IA está com cota limitada. Enquanto isso, você pode explorar nossos pontos turísticos na página Explore ou me fazer perguntas específicas sobre Inhambane, a 'Terra da Boa Gente'!"
        
        elif any(word in user_message_lower for word in ['ponto', 'turístico', 'lugar', 'visitar', 'recomenda']):
            if pontos:
                # Recomendar alguns pontos baseados no banco de dados
                recomendacoes = "\n".join([f"- {ponto['nome']}: {ponto['descricao'][:100]}..." for ponto in pontos[:3]])
                return f"Baseado em nossos dados, aqui estão alguns pontos turísticos em Inhambane:\n\n{recomendacoes}\n\nPara mais detalhes, visite a página Explore. Inhambane é a 'Terra da Boa Gente'!"
            else:
                return "Inhambane, a 'Terra da Boa Gente', tem muitos pontos turísticos incríveis! No momento nosso serviço de IA está com cota limitada. Você pode explorar todos os pontos na página Explore."
        
        else:
            return "Olá! Sou o assistente Txopela. No momento, nosso serviço de IA está com cota limitada. Você pode:\n1. Explorar pontos turísticos na página Explore\n2. Fazer perguntas específicas sobre Inhambane\n3. Voltar mais tarde quando o serviço estiver normalizado\n\nInhambane é a 'Terra da Boa Gente'!"
    
    def _get_fallback_response(self, user_message: str):
        """Resposta de fallback quando o serviço não está disponível"""
        return "Olá! Sou o assistente Txopela, especialista em turismo de Inhambane, a 'Terra da Boa Gente'. No momento, nosso serviço de IA está temporariamente indisponível. Você pode:\n\n1. Explorar nossos pontos turísticos na página Explore\n2. Verificar as categorias disponíveis\n3. Voltar mais tarde\n\nDesculpe pelo inconveniente!"
    
    def get_recommendations(self, preferences: str):
        """Gera recomendações personalizadas baseadas em preferências"""
        if not self.api_key:
            context, pontos = self.get_context_from_db(preferences)
            return {
                'explanation': 'Serviço de IA temporariamente indisponível. Aqui estão alguns pontos turísticos que podem interessar:',
                'pontos': pontos[:3]
            }
        
        try:
            context, pontos = self.get_context_from_db(preferences)
            
            prompt = f"""Com base nas preferências do turista: "{preferences}"
            
E nos seguintes pontos turísticos disponíveis:
{context}

Recomende os 3 melhores pontos turísticos e explique brevemente por quê.
Seja caloroso e mencione que Inhambane é a "Terra da Boa Gente"."""
            
            # Chamar a API REST do Gemini
            url = f"{self.base_url}/{self.model_name}:generateContent?key={self.api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                }
            }
            
            headers = {
                "Content-Type": "application/json"
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if "candidates" in result and len(result["candidates"]) > 0:
                    explanation = result["candidates"][0]["content"]["parts"][0]["text"]
                    return {
                        'explanation': explanation,
                        'pontos': pontos[:3]
                    }
                else:
                    print(f"Resposta inesperada da API: {result}")
                    return {
                        'explanation': f'Com base nas suas preferências "{preferences}", aqui estão alguns pontos turísticos recomendados em Inhambane, a "Terra da Boa Gente":',
                        'pontos': pontos[:3]
                    }
            else:
                print(f"Erro na API Gemini: {response.status_code} - {response.text}")
                if response.status_code == 429:  # Quota exceeded
                    return {
                        'explanation': f'Com base nas suas preferências "{preferences}", aqui estão alguns pontos turísticos recomendados em Inhambane, a "Terra da Boa Gente":',
                        'pontos': pontos[:3]
                    }
                return {
                    'explanation': 'Aqui estão alguns pontos turísticos recomendados:',
                    'pontos': pontos[:3]
                }
                
        except Exception as e:
            print(f"Erro nas recomendações: {type(e).__name__}: {e}")
            context, pontos = self.get_context_from_db(preferences)
            return {
                'explanation': 'Aqui estão alguns pontos turísticos recomendados:',
                'pontos': pontos[:3]
            }

gemini_service = GeminiService()
