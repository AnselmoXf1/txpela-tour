try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    print("⚠️  google-generativeai não instalado. Funcionalidades de IA desabilitadas.")

from django.conf import settings
from pontos_turisticos.mongodb import mongodb

class GeminiService:
    def __init__(self):
        if not GENAI_AVAILABLE:
            self.model = None
            print("⚠️  Serviço de IA não disponível. Instale: pip install google-generativeai")
            return
            
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            # Usar modelo disponível baseado no teste
            self.model = genai.GenerativeModel('models/gemini-2.0-flash')
        except Exception as e:
            self.model = None
            print(f"⚠️  Erro ao configurar Gemini: {e}")
        
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
        if not self.model:
            return "Desculpe, o serviço de IA está temporariamente indisponível. Por favor, explore nossos pontos turísticos na página Explore."
        
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
            
            messages = [system_prompt]
            if conversation_history:
                messages.extend(conversation_history)
            messages.append(user_message)
            
            response = self.model.generate_content(messages)
            return response.text
        except Exception as e:
            print(f"Erro no chat: {e}")
            return "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente."
    
    def get_recommendations(self, preferences: str):
        """Gera recomendações personalizadas baseadas em preferências"""
        if not self.model:
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
            
            response = self.model.generate_content(prompt)
            
            return {
                'explanation': response.text,
                'pontos': pontos[:3]
            }
        except Exception as e:
            print(f"Erro nas recomendações: {e}")
            context, pontos = self.get_context_from_db(preferences)
            return {
                'explanation': 'Aqui estão alguns pontos turísticos recomendados:',
                'pontos': pontos[:3]
            }

gemini_service = GeminiService()
