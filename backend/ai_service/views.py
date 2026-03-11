from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .services import gemini_service
from pontos_turisticos.serializers import PontoTuristicoSerializer

class ChatView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Endpoint para chat com a IA"""
        messages = request.data.get('messages', [])
        if not messages:
            return Response({'error': 'Mensagens não fornecidas'}, status=status.HTTP_400_BAD_REQUEST)
        
        last_message = messages[-1]['content']
        conversation_history = [msg['content'] for msg in messages[:-1]]
        
        try:
            response = gemini_service.chat(last_message, conversation_history)
            return Response({'response': response})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RecommendationsView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Endpoint para recomendações personalizadas"""
        preferences = request.data.get('preferences', '')
        if not preferences:
            return Response({'error': 'Preferências não fornecidas'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = gemini_service.get_recommendations(preferences)
            serializer = PontoTuristicoSerializer(result['pontos'], many=True)
            return Response({
                'explanation': result['explanation'],
                'recommendations': serializer.data
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
