"""
Script para testar conexão com MongoDB
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'txopela_backend.settings')
django.setup()

from django.conf import settings
from pymongo import MongoClient

def test_mongodb_connection():
    """Testa conexão com MongoDB"""
    print("=" * 50)
    print("TESTE DE CONEXÃO MONGODB")
    print("=" * 50)
    print()
    
    print(f"URI: {settings.MONGODB_URI[:50]}...")
    print(f"Database: {settings.MONGODB_DB_NAME}")
    print()
    
    try:
        print("Tentando conectar...")
        client = MongoClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=10000,  # 10 segundos
            connectTimeoutMS=10000,
            socketTimeoutMS=10000
        )
        
        # Testa a conexão
        client.admin.command('ping')
        print("✓ Conexão estabelecida!")
        print()
        
        # Acessa o banco
        db = client[settings.MONGODB_DB_NAME]
        print(f"✓ Banco de dados acessado: {db.name}")
        print()
        
        # Lista collections
        collections = db.list_collection_names()
        print(f"Collections disponíveis: {collections}")
        print()
        
        # Conta documentos
        if 'pontos_turisticos' in collections:
            count = db.pontos_turisticos.count_documents({})
            print(f"✓ Pontos turísticos no banco: {count}")
        else:
            print("⚠ Collection 'pontos_turisticos' não existe ainda")
        
        print()
        print("=" * 50)
        print("TESTE CONCLUÍDO COM SUCESSO!")
        print("=" * 50)
        
        client.close()
        return True
        
    except Exception as e:
        print()
        print("=" * 50)
        print("ERRO NA CONEXÃO!")
        print("=" * 50)
        print()
        print(f"Erro: {str(e)}")
        print()
        print("Possíveis causas:")
        print("1. Sem conexão com a internet")
        print("2. Credenciais do MongoDB incorretas")
        print("3. IP não autorizado no MongoDB Atlas")
        print("4. Firewall bloqueando a conexão")
        print()
        print("Soluções:")
        print("1. Verifique sua conexão com a internet")
        print("2. Verifique o MONGODB_URI no arquivo .env")
        print("3. No MongoDB Atlas, vá em Network Access e adicione seu IP")
        print("4. Desative temporariamente o firewall/antivírus")
        print()
        return False

if __name__ == '__main__':
    success = test_mongodb_connection()
    sys.exit(0 if success else 1)
