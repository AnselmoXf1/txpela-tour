from pymongo import MongoClient, GEOSPHERE
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class MongoDBConnection:
    _instance = None
    _client = None
    _db = None
    _indexes_created = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBConnection, cls).__new__(cls)
        return cls._instance

    @classmethod
    def _connect(cls):
        """Conecta ao MongoDB de forma lazy"""
        if cls._client is None:
            try:
                logger.info("Conectando ao MongoDB...")
                cls._client = MongoClient(
                    settings.MONGODB_URI,
                    serverSelectionTimeoutMS=5000,  # 5 segundos timeout
                    connectTimeoutMS=5000,
                    socketTimeoutMS=5000
                )
                cls._db = cls._client[settings.MONGODB_DB_NAME]
                # Testa a conexão
                cls._client.admin.command('ping')
                logger.info(f"Conectado ao MongoDB: {settings.MONGODB_DB_NAME}")
            except Exception as e:
                logger.error(f"Erro ao conectar ao MongoDB: {e}")
                cls._client = None
                cls._db = None
                raise

    @classmethod
    def _setup_indexes(cls):
        """Cria índices necessários no MongoDB"""
        if cls._indexes_created:
            return
        
        try:
            pontos_collection = cls._db.pontos_turisticos
            # Índice geoespacial para buscas por proximidade
            pontos_collection.create_index([("localizacao", GEOSPHERE)])
            # Índice de texto para busca
            try:
                pontos_collection.create_index([("nome", "text"), ("descricao", "text")])
            except Exception as e:
                logger.warning(f"Índice de texto já existe ou erro: {e}")
            cls._indexes_created = True
            logger.info("Índices do MongoDB criados/verificados")
        except Exception as e:
            logger.error(f"Erro ao criar índices: {e}")

    @classmethod
    def get_database(cls):
        if cls._db is None:
            cls._connect()
            if cls._db is not None:
                cls._setup_indexes()
        return cls._db

    @classmethod
    def get_collection(cls, collection_name):
        db = cls.get_database()
        if db is None:
            raise Exception("MongoDB não conectado. Verifique a conexão com a internet e as credenciais.")
        return db[collection_name]

    @property
    def db(self):
        """Propriedade para acesso ao banco"""
        return self.get_database()

# Singleton instance (não conecta imediatamente)
mongodb = MongoDBConnection()
