"""
Este app usa MongoDB diretamente via PyMongo.
Não há models Django tradicionais.

Estrutura do documento BSON para pontos_turisticos:
{
    "_id": ObjectId,
    "nome": str,
    "descricao": str,
    "categoria": str,  # praia, restaurante, hotel, pousada, atracao, mergulho, cultura, natureza
    "localizacao": {
        "type": "Point",
        "coordinates": [longitude, latitude]  # GeoJSON format
    },
    "imagens": [
        {
            "url": str,
            "public_id": str,
            "alt": str
        }
    ],
    "reviews": [
        {
            "usuario": str,
            "rating": int,  # 1-5
            "comentario": str,
            "data": datetime
        }
    ],
    "preco_medio": float,  # opcional
    "horario_funcionamento": str,  # opcional
    "contato": str  # opcional
}
"""
