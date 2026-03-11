# 📸 Edição de Fotos - Guia Rápido

## Como Usar

### 1. Acesse o Admin Panel
```bash
cd admin-app
npm run dev
```
Acesse: http://localhost:5173

### 2. Vá para Pontos Turísticos
- Faça login com credenciais de admin
- Clique em "Pontos Turísticos" no menu lateral

### 3. Edite as Fotos
- Clique no ícone roxo de imagem (📷) na linha do ponto desejado
- Uma modal será aberta com todas as funcionalidades

## Funcionalidades

### ✅ Upload de Imagens
- **Drag & Drop**: Arraste imagens para a área de upload
- **Seleção Manual**: Clique em "Selecionar Arquivos"
- **Múltiplas Imagens**: Envie várias de uma vez

### ✅ Reordenar Imagens
- Clique e arraste as imagens para reordenar
- A primeira imagem é sempre a principal
- Salvamento automático

### ✅ Definir Imagem Principal
- Passe o mouse sobre a imagem
- Clique no botão de estrela (⭐)
- A imagem vai para a primeira posição

### ✅ Deletar Imagens
- Passe o mouse sobre a imagem
- Clique no botão de lixeira (🗑️)
- Confirme a exclusão

## Atalhos

### Iniciar Tudo de Uma Vez
```bash
# Na raiz do projeto
QUICK-START-EDICAO-FOTOS.bat
```

### Ver Documentação Completa
```bash
# Na raiz do projeto
start EDICAO-FOTOS.md
```

## Dicas

💡 **Ordem das Imagens**: A primeira imagem aparece como destaque nos cards e detalhes

💡 **Qualidade**: As imagens são otimizadas automaticamente para 1200x800px

💡 **Formatos**: Aceita PNG, JPG e WEBP

💡 **Tamanho**: Máximo 10MB por imagem

## Troubleshooting

❌ **Erro ao fazer upload?**
- Verifique as credenciais do Cloudinary no `.env`
- Confirme que o backend está rodando

❌ **Imagens não aparecem?**
- Limpe o cache do navegador
- Verifique a conexão com o Cloudinary

❌ **Não consegue reordenar?**
- Confirme que está logado como admin
- Verifique se o backend está respondendo
