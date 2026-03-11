"""
Script para popular o MongoDB com dados iniciais de pontos turísticos de Inhambane
Execute: python seed_pontos.py
"""

from pontos_turisticos.mongodb import mongodb
from datetime import datetime

# Dados de pontos turísticos em Inhambane
pontos_turisticos = [
    {
        "nome": "Praia de Tofo",
        "descricao": "Uma das praias mais famosas de Moçambique, conhecida mundialmente pelo mergulho com tubarões-baleia e raias manta. Águas cristalinas e areias brancas.",
        "categoria": "praia",
        "localizacao": {
            "type": "Point",
            "coordinates": [35.5500, -23.8500]  # [longitude, latitude]
        },
        "imagens": [
            {
                "url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
                "public_id": "tofo_beach_1",
                "alt": "Vista aérea da Praia de Tofo"
            }
        ],
        "reviews": [
            {
                "usuario": "João Silva",
                "rating": 5,
                "comentario": "Experiência incrível! Vi tubarões-baleia de perto.",
                "data": datetime.now().isoformat()
            }
        ],
        "preco_medio": 0.0,
        "horario_funcionamento": "24 horas",
        "contato": "+258 29 370 000"
    },
    {
        "nome": "Praia de Barra",
        "descricao": "Praia tranquila com o famoso farol vermelho e branco. Ideal para famílias e mergulho. Águas calmas e recifes de coral.",
        "categoria": "praia",
        "localizacao": {
            "type": "Point",
            "coordinates": [35.5167, -23.8333]
        },
        "imagens": [
            {
                "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
                "public_id": "barra_beach_1",
                "alt": "Farol da Praia de Barra"
            }
        ],
        "reviews": [
            {
                "usuario": "Maria Santos",
                "rating": 5,
                "comentario": "Praia linda e tranquila! O farol é icônico.",
                "data": datetime.now().isoformat()
            }
        ],
        "preco_medio": 0.0,
        "horario_funcionamento": "24 horas",
        "contato": ""
    },
    {
        "nome": "Praia de Paindane",
        "descricao": "Praia isolada e paradisíaca, perfeita para quem busca tranquilidade. Excelente para snorkeling e observação de vida marinha.",
        "categoria": "praia",
        "localizacao": {
            "type": "Point",
            "coordinates": [35.5300, -23.7800]
        },
        "imagens": [
            {
                "url": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
                "public_id": "paindane_beach",
                "alt": "Praia de Paindane"
            }
        ],
        "reviews": [],
        "preco_medio": 0.0,
        "horario_funcionamento": "24 horas",
        "contato": ""
    },
    {
        "nome": "Praia de Coconut Bay",
        "descricao": "Baía protegida com coqueiros e águas calmas. Ideal para famílias com crianças e para relaxar.",
        "categoria": "praia",
        "localizacao": {
            "type": "Point",
            "coordinates": [35.5400, -23.8200]
        },
        "imagens": [
            {
                "url": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
                "public_id": "coconut_bay",
                "alt": "Coconut Bay"
            }
        ],
        "reviews": [
            {
                "usuario": "Carlos Mendes",
                "rating": 4,
                "comentario": "Lugar perfeito para relaxar com a família.",
                "data": datetime.now().isoformat()
            }
        ],
        "preco_medio": 0.0,
        "horario_funcionamento": "24 horas",
        "contato": ""
    },
    {
        "nome": "Praia de Guinjata",
        "descricao": "Praia selvagem e intocada, conhecida por suas dunas e ondas perfeitas para surf. Ambiente natural preservado.",
        "categoria": "praia",
        "localizacao": {
            "type": "Point",
            "coordinates": [35.5600, -23.9000]
        },
        "imagens": [
            {
                "url": "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
                "public_id": "guinjata_beach",
                "alt": "Praia de Guinjata"
            }
        ],
        "reviews": [],
        "preco_medio": 0.0,
        "horario_funcionamento": "24 horas",
        "contato": ""
    },
    {
        "nome": "Restaurante Pescador",
        "descricao": "Restaurante à beira-mar especializado em frutos do mar frescos. Experimente o camarão grelhado e a lagosta de Inhambane.",
        "categoria": "restaurante",
        "localizacao": {
            "type": "Point",
            "coordinates": [35.3833, -23.8650]
        },
        "imagens": [
            {
                "url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
                "public_id": "pescador_restaurant",
                "alt": "Interior do Restaurante Pescador"
            }
        ],
        "reviews": [
            {
                "usuario": "Maria Costa",
                "rating": 4,
                "comentario": "Comida deliciosa e vista maravilhosa para o mar!",
                "data": datetime.now().isoformat()
            }
        ],
        "preco_medio": 800.0,
        "horario_funcionamento": "11:00 - 22:00",
        "contato": "+258 29 320 123"
    },
    {
        "nome": "Pousada Palmeiras",
        "descricao": "Pousada aconchegante com vista para o mar. Quartos confortáveis, café da manhã incluído e piscina.",
        "categoria": "pousada",
        "localizacao": {
            "type": "Point",
            "coordinates": [35.3900, -23.8600]
        },
        "imagens": [
            {
                "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "public_id": "pousada_palmeiras",
                "alt": "Fachada da Pousada Palmeiras"
            }
        ],
        "reviews": [
            {
                "usuario": "Pedro Santos",
                "rating": 5,
                "comentario": "Atendimento excelente e localização perfeita!",
                "data": datetime.now().isoformat()
            }
        ],
        "preco_medio": 2500.0,
        "horario_funcionamento": "Check-in: 14:00 | Check-out: 11:00",
        "contato": "+258 29 320 456"
    },
    {
        "nome": "Centro de Mergulho Tofo Scuba",
        "descricao": "Centro de mergulho certificado PADI. Oferece cursos para iniciantes e mergulhos com tubarões-baleia e raias manta.",
        "categoria": "mergulho",
        "localizacao": {
            "type": "Point",
            "coordinates": [35.5480, -23.8520]
        },
        "imagens": [
            {
                "url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
                "public_id": "tofo_scuba",
                "alt": "Equipamento de mergulho"
            }
        ],
        "reviews": [
            {
                "usuario": "Ana Ferreira",
                "rating": 5,
                "comentario": "Instrutores profissionais e experiência inesquecível!",
                "data": datetime.now().isoformat()
            }
        ],
        "preco_medio": 3500.0,
        "horario_funcionamento": "08:00 - 17:00",
        "contato": "+258 29 370 100"
    },
    {
        "nome": "Mercado Municipal de Inhambane",
        "descricao": "Mercado tradicional com produtos locais, artesanato, frutas tropicais e especiarias. Experiência cultural autêntica.",
        "categoria": "cultura",
        "localizacao": {
            "type": "Point",
            "coordinates": [35.3850, -23.8640]
        },
        "imagens": [
            {
                "url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
                "public_id": "mercado_inhambane",
                "alt": "Mercado Municipal de Inhambane"
            }
        ],
        "reviews": [
            {
                "usuario": "Luís Macamo",
                "rating": 4,
                "comentario": "Ótimo lugar para conhecer a cultura local e comprar artesanato.",
                "data": datetime.now().isoformat()
            }
        ],
        "preco_medio": 200.0,
        "horario_funcionamento": "06:00 - 18:00",
        "contato": ""
    }
]

def seed_database():
    """Popula o banco de dados com dados iniciais"""
    print("🌴 Iniciando população do banco de dados...")
    collection = mongodb.get_collection('pontos_turisticos')
    
    # Limpa a coleção existente (cuidado em produção!)
    deleted_count = collection.delete_many({}).deleted_count
    print(f"🗑️  {deleted_count} documentos antigos removidos")
    
    # Insere os dados
    result = collection.insert_many(pontos_turisticos)
    print(f"✅ {len(result.inserted_ids)} pontos turísticos inseridos com sucesso!")
    
    # Cria índice de texto para busca
    try:
        collection.create_index([("nome", "text"), ("descricao", "text"), ("categoria", "text")])
        print("📝 Índice de texto criado para busca")
    except Exception as e:
        print(f"⚠️  Índice de texto já existe: {e}")
    
    # Cria índice geoespacial para busca por proximidade
    try:
        collection.create_index([("localizacao", "2dsphere")])
        print("🗺️  Índice geoespacial criado")
    except Exception as e:
        print(f"⚠️  Índice geoespacial já existe: {e}")
    
    # Verifica os índices
    indexes = list(collection.list_indexes())
    print(f"\n📋 Total de índices: {len(indexes)}")
    for index in indexes:
        print(f"  - {index['name']}")
    
    # Lista os pontos inseridos
    print(f"\n🏖️  Praias inseridas:")
    praias = collection.find({"categoria": "praia"})
    for praia in praias:
        print(f"  - {praia['nome']}")

if __name__ == "__main__":
    seed_database()
