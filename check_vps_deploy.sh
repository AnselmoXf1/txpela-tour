#!/bin/bash

echo "=== VERIFICAÇÃO DE DEPLOY NO VPS ==="
echo ""

# 1. Verificar serviços
echo "1. Verificando serviços..."
echo "   Nginx: $(sudo systemctl is-active nginx)"
echo "   Txopela: $(sudo systemctl is-active txopela 2>/dev/null || echo 'Não configurado')"

# 2. Verificar portas
echo ""
echo "2. Verificando portas..."
echo "   Porta 80 (HTTP): $(sudo netstat -tlnp | grep :80 | wc -l) processos"
echo "   Porta 8000 (API): $(sudo netstat -tlnp | grep :8000 | wc -l) processos"

# 3. Verificar diretórios
echo ""
echo "3. Verificando diretórios..."
echo "   Projeto: $(ls -la /var/www/txopela 2>/dev/null | head -1 || echo 'Não encontrado')"
echo "   Backend: $(ls -la /var/www/txopela/backend 2>/dev/null | head -1 || echo 'Não encontrado')"
echo "   Frontend: $(ls -la /var/www/txopela/frontend-vite/dist 2>/dev/null | head -1 || echo 'Não encontrado')"

# 4. Testar API
echo ""
echo "4. Testando API..."
API_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/ai/chat/ -X POST -H "Content-Type: application/json" -d '{"messages": [{"content": "teste"}]}' 2>/dev/null)
echo "   Status API: $API_TEST"

# 5. Testar frontend
echo ""
echo "5. Testando frontend..."
FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null)
echo "   Status Frontend: $FRONTEND_TEST"

# 6. Verificar logs
echo ""
echo "6. Últimos logs do Nginx:"
sudo tail -5 /var/log/nginx/error.log 2>/dev/null || echo "   Logs não encontrados"

echo ""
echo "7. Últimos logs da aplicação:"
sudo journalctl -u txopela -n 5 2>/dev/null || echo "   Serviço não configurado"

echo ""
echo "=== RESUMO ==="
echo "IP do VPS: 75.119.133.19"
echo "URLs para testar:"
echo "  - Frontend: http://75.119.133.19"
echo "  - API: http://75.119.133.19/api/ai/chat/"
echo "  - Admin: http://75.119.133.19/admin"
echo "  - Business: http://75.119.133.19/business"

echo ""
echo "Comandos úteis:"
echo "  - Ver logs em tempo real: sudo journalctl -u txopela -f"
echo "  - Reiniciar tudo: sudo systemctl restart txopela nginx"
echo "  - Atualizar código: cd /var/www/txopela && git pull"
echo "  - Rebuild frontend: cd /var/www/txopela/frontend-vite && npm run build"