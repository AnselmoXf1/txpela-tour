# Corrigir Erro de Autenticação MongoDB

## Erro Atual
```
pymongo.errors.OperationFailure: bad auth : authentication failed
```

## Causa
A senha do MongoDB no arquivo `.env` está incorreta ou precisa ser codificada.

## Solução

### Opção 1: Verificar a senha no MongoDB Atlas

1. Acesse: https://cloud.mongodb.com
2. Vá em "Database Access" (no menu lateral)
3. Encontre o usuário `txopito-ADMIN`
4. Clique em "Edit"
5. Clique em "Edit Password"
6. Defina uma nova senha SIMPLES (sem caracteres especiais)
   - Exemplo: `TxopelaAdmin2024`
7. Clique em "Update User"

### Opção 2: Codificar a senha atual

Se sua senha for `txopitoAdmin` (sem os `<>`), ela está correta.

Mas se tiver caracteres especiais, você precisa codificá-los:

**Caracteres que precisam ser codificados:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `^` → `%5E`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`

**Exemplo:**
- Senha: `Pass@123` → `Pass%40123`
- Senha: `My#Pass$` → `My%23Pass%24`

### Opção 3: Criar novo usuário (Recomendado)

1. Acesse: https://cloud.mongodb.com
2. Vá em "Database Access"
3. Clique em "Add New Database User"
4. Escolha "Password" como método de autenticação
5. Username: `txopela_user`
6. Password: `TxopelaAdmin2024` (senha simples, sem caracteres especiais)
7. Database User Privileges: "Atlas admin"
8. Clique em "Add User"

Depois, atualize o `.env`:

```env
MONGODB_URI=mongodb+srv://txopela_user:TxopelaAdmin2024@cluster0.bt5at8j.mongodb.net/txopela_tour?retryWrites=true&w=majority&appName=Cluster0
```

### Opção 4: Verificar Network Access (Whitelist de IP)

1. Acesse: https://cloud.mongodb.com
2. Vá em "Network Access"
3. Verifique se seu IP está na lista
4. Se não estiver, clique em "Add IP Address"
5. Escolha "Allow Access from Anywhere" (0.0.0.0/0) para desenvolvimento
6. Clique em "Confirm"

## Testar a Conexão

Depois de corrigir, teste novamente:

```cmd
python manage.py migrate
```

Se funcionar, você verá:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  ...
```

## Ainda não funciona?

Execute este script Python para testar a conexão diretamente:

```cmd
python
```

```python
from pymongo import MongoClient

# Cole sua connection string aqui
uri = "mongodb+srv://txopito-ADMIN:SUA_SENHA@cluster0.bt5at8j.mongodb.net/?retryWrites=true&w=majority"

try:
    client = MongoClient(uri)
    # Tenta listar os databases
    print("Databases:", client.list_database_names())
    print("✅ Conexão bem-sucedida!")
except Exception as e:
    print("❌ Erro:", e)
```

Se der erro, o problema é na senha ou no IP whitelist.
