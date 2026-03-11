"""
Script para criar superusuário admin automaticamente
Execute: python manage.py shell < create_admin.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'txopela_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Dados do admin
username = 'admin'
email = 'admin@txopelatour.com'
password = 'admin123'

# Verifica se já existe
if User.objects.filter(username=username).exists():
    print(f'❌ Usuário "{username}" já existe!')
    user = User.objects.get(username=username)
    print(f'📧 Email: {user.email}')
    print(f'🔑 Use a senha que você definiu anteriormente')
else:
    # Cria o superusuário
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        first_name='Admin',
        last_name='Txopela',
        role='admin'
    )
    print('✅ Superusuário criado com sucesso!')
    print(f'👤 Username: {username}')
    print(f'📧 Email: {email}')
    print(f'🔑 Password: {password}')
    print(f'\n🌐 Acesse: http://localhost:8000/admin/')
