# Configuração do Backend - Txopela Tour

## ✅ Passo a Passo

### 1. Editar o arquivo .env

O arquivo `.env` já foi criado. Você precisa editar e configurar:

#### 1.1 MongoDB Atlas (OBRIGATÓRIO)

Abra o arquivo `.env` e substitua `<txopito-admin>` pela senha real:

```env
MONGODB_URI=mongodb+srv://txopito-ADMIN:SUA_SENHA_AQUI@cluster0.bt5at8j.mongodb.net/txopela_tour?retryWrites=true&w=majority&appName=Cluster0
```

**Exemplo:**
Se sua senha for `Senha123`, ficaria:
```env
MONGODB_URI=mongodb+srv://txopito-ADMIN:Senha123@cluster0.bt5at8j.mongodb.net/txopela_tour?retryWrites=true&w=majority&appName=Cluster0
```

**⚠️ IMPORTANTE:** 
- Se sua senha tiver caracteres especiais (@, #, $, etc), você precisa codificá-los:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - Exemplo: senha `Pass@123` → `Pass%40123`

#### 1.2 Google Gemini AI (OBRIGATÓRIO para ChatBot)

1. Acesse: https://makersuite.google.com/app/apikey
2. Crie uma API Key
3. Cole no `.env`:

```env
GEMINI_API_KEY=AIzaSy...sua-chave-aqui
```

#### 1.3 Cloudinary (OPCIONAL - pode deixar como está)

Para o MVP, pode deixar os valores `demo`. Mais tarde, se quiser upload de imagens:

1. Acesse: https://cloudinary.com
2. Crie uma conta gratuita
3. No Dashboard, copie:
   - Cloud Name
   - API Key
   - API Secret
4. Cole no `.env`

---

### 2. Executar Migrações

```cmd
python manage.py migrate
```

Isso criará as tabelas necessárias no SQLite (para autenticação Django).

---

### 3. Popular o Banco de Dados

```cmd
python manage.py shell
```

Dentro do shell Python, execute:

```python
from pontos_turisticos.seed_data import seed_database
seed_database()
exit()
```

Você verá:
```
✅ 6 pontos turísticos inseridos com sucesso!

📋 Índices criados:
  - _id_
  - localizacao_2dsphere
  - nome_text_descricao_text
```

---

### 4. Criar Superusuário (Opcional)

Para acessar o Django Admin:

```cmd
python manage.py createsuperuser
```

Preencha:
- Username: admin
- Email: admin@txopelatour.com
- Password: (sua senha)

---

### 5. Iniciar o Servidor

```cmd
python manage.py runserver
```

Ou use o script:
```cmd
start-backend.bat
```

---

## ✅ Verificar se está funcionando

### Testar API

Abra o navegador em:

1. **Listar pontos turísticos:**
   http://localhost:8000/api/pontos-turisticos/

   Você deve ver um JSON com 6 pontos turísticos.

2. **Django Admin:**
   http://localhost:8000/admin/
   
   Login com o superusuário criado.

### Testar MongoDB

Se quiser verificar os dados no MongoDB:

1. Acesse: https://cloud.mongodb.com
2. Vá em "Database" → "Browse Collections"
3. Selecione o database `txopela_tour`
4. Veja a collection `pontos_turisticos` com 6 documentos

---

## 🔧 Troubleshooting

### Erro: "Authentication failed"

Verifique:
1. A senha no `.env` está correta?
2. Caracteres especiais estão codificados?
3. O usuário `txopito-ADMIN` existe no MongoDB Atlas?

### Erro: "IP not whitelisted"

No MongoDB Atlas:
1. Vá em "Network Access"
2. Clique em "Add IP Address"
3. Escolha "Allow Access from Anywhere" (0.0.0.0/0) para desenvolvimento
4. Clique em "Confirm"

### Erro: "No module named 'pymongo'"

Execute novamente:
```cmd
pip install pymongo==4.6.2
```

### Erro: "GEMINI_API_KEY not found"

Verifique se o arquivo `.env` está na pasta `backend/` e se a variável está configurada.

---

## 📝 Próximos Passos

Após configurar o backend:

1. ✅ Teste os endpoints da API
2. ✅ Configure o frontend
3. ✅ Teste o ChatBot com Gemini
4. ✅ Adicione mais pontos turísticos reais

---

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique os logs do servidor
2. Confirme que todas as dependências foram instaladas
3. Teste a connection string do MongoDB separadamente
4. Verifique se o Gemini API Key está válida
