#!/usr/bin/env python
"""
Script para verificar se o usuário admin existe e tem permissões corretas
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'txopela_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 50)
print("VERIFICAÇÃO DO USUÁRIO ADMIN")
print("=" * 50)

try:
    admin = User.objects.get(username='admin')
    print(f"\n✅ Usuário admin encontrado!")
    print(f"   ID: {admin.id}")
    print(f"   Username: {admin.username}")
    print(f"   Email: {admin.email}")
    print(f"   Nome: {admin.first_name} {admin.last_name}")
    print(f"   is_staff: {admin.is_staff}")
    print(f"   is_superuser: {admin.is_superuser}")
    print(f"   is_active: {admin.is_active}")
    
    if admin.is_staff:
        print("\n✅ Usuário tem permissão de staff (pode acessar admin)")
    else:
        print("\n❌ Usuário NÃO tem permissão de staff")
        print("   Corrigindo...")
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()
        print("   ✅ Permissões atualizadas!")
        
except User.DoesNotExist:
    print("\n❌ Usuário admin não encontrado!")
    print("   Execute: create-admin.bat")

print("\n" + "=" * 50)
