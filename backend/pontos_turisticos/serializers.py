from rest_framework import serializers

class ImagemSerializer(serializers.Serializer):
    url = serializers.URLField()
    public_id = serializers.CharField()
    alt = serializers.CharField()

class ReviewSerializer(serializers.Serializer):
    usuario = serializers.CharField()
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comentario = serializers.CharField()
    data = serializers.DateTimeField()

class LocalizacaoSerializer(serializers.Serializer):
    type = serializers.CharField(default='Point')
    coordinates = serializers.ListField(
        child=serializers.FloatField(),
        min_length=2,
        max_length=2
    )

class PontoTuristicoSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    nome = serializers.CharField(max_length=200)
    descricao = serializers.CharField()
    categoria = serializers.ChoiceField(choices=[
        'praia', 'restaurante', 'hotel', 'pousada', 
        'atracao', 'mergulho', 'cultura', 'natureza'
    ])
    localizacao = LocalizacaoSerializer()
    imagens = ImagemSerializer(many=True)
    reviews = ReviewSerializer(many=True, required=False)
    preco_medio = serializers.FloatField(required=False, allow_null=True)
    horario_funcionamento = serializers.CharField(required=False, allow_blank=True)
    contato = serializers.CharField(required=False, allow_blank=True)
    
    def to_representation(self, instance):
        """Converte ObjectId para string"""
        data = super().to_representation(instance)
        if '_id' in instance:
            data['_id'] = str(instance['_id'])
        return data
