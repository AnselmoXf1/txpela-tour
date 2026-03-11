# Popular Banco de Dados

Este guia explica como popular o MongoDB com dados de pontos turísticos de Inhambane.

## Dados Incluídos

O script `seed_pontos.py` insere os seguintes pontos turísticos:

### Praias (5)
- Praia de Tofo
- Praia de Barra
- Praia de Paindane
- Praia de Coconut Bay
- Praia de Guinjata

### Outros (4)
- Restaurante Pescador
- Pousada Palmeiras
- Centro de Mergulho Tofo Scuba
- Mercado Municipal de Inhambane

## Como Executar

### Opção 1: Script Batch (Recomendado)
```bash
seed-database.bat
```

### Opção 2: Manualmente
```bash
# Ativar ambiente virtual
venv\Scripts\activate

# Executar script
python seed_pontos.py
```

## O que o Script Faz

1. ✅ Remove dados antigos da coleção `pontos_turisticos`
2. ✅ Insere 10 pontos turísticos com:
   - Nome, descrição e categoria
   - Coordenadas geográficas (latitude/longitude)
   - Imagens (URLs do Unsplash)
   - Avaliações de exemplo
   - Informações de contato e horários
3. ✅ Cria índices para:
   - Busca por texto (nome, descrição, categoria)
   - Busca geoespacial (proximidade)

## Verificar Dados

Após executar o script, você pode verificar os dados:

### No MongoDB Compass
1. Conecte em `mongodb://localhost:27017`
2. Acesse database `txopela_tour`
3. Veja a coleção `pontos_turisticos`

### Via API
```bash
# Listar todos os pontos
curl http://localhost:8000/api/pontos-turisticos/

# Buscar por texto
curl http://localhost:8000/api/pontos-turisticos/search/?q=praia

# Buscar por categoria
curl http://localhost:8000/api/pontos-turisticos/search/?q=tofo
```

## Busca no Frontend

A busca funciona de duas formas:

1. **Busca Local (Filtro)**: Filtra os pontos já carregados enquanto você digita
2. **Busca na API**: Ao pressionar Enter ou clicar no botão de busca, faz uma requisição à API

Ambas buscam em:
- Nome do ponto turístico
- Descrição
- Categoria

## Notas

- ⚠️ O script remove TODOS os dados existentes antes de inserir os novos
- 📝 As coordenadas são reais de Inhambane, Moçambique
- 🖼️ As imagens são do Unsplash (gratuitas)
- 🔍 A busca funciona mesmo sem índice de texto (usa regex como fallback)
