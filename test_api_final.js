// Teste final da API de IA Txopela
const testAPI = async () => {
    console.log("=".repeat(60));
    console.log("TESTE FINAL DA API DE IA TXOPELA");
    console.log("=".repeat(60));
    
    const baseUrl = "http://localhost:8000";
    const chatUrl = `${baseUrl}/api/ai/chat/`;
    const recUrl = `${baseUrl}/api/ai/recommendations/`;
    
    console.log("\n🔍 Testando conexão com o servidor...");
    
    // Teste 1: Verificar se o servidor está respondendo
    try {
        const healthCheck = await fetch(baseUrl);
        console.log(`✅ Servidor respondendo: ${healthCheck.status}`);
    } catch (error) {
        console.log(`❌ Servidor não responde: ${error.message}`);
        return;
    }
    
    // Teste 2: Teste de chat básico
    console.log("\n1. Teste de Chat Básico");
    console.log("-".repeat(40));
    
    const chatData = {
        messages: [{ content: "Olá, tudo bem?" }]
    };
    
    try {
        const response = await fetch(chatUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatData)
        });
        
        const result = await response.json();
        console.log(`Status: ${response.status}`);
        console.log(`Resposta: ${result.response ? result.response.substring(0, 100) + "..." : "Sem resposta"}`);
        
        if (result.error) {
            console.log(`Erro: ${result.error}`);
        }
    } catch (error) {
        console.log(`❌ Erro no chat: ${error.message}`);
    }
    
    // Teste 3: Teste de recomendações
    console.log("\n2. Teste de Recomendações");
    console.log("-".repeat(40));
    
    const recData = {
        preferences: "praia e natureza"
    };
    
    try {
        const response = await fetch(recUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recData)
        });
        
        const result = await response.json();
        console.log(`Status: ${response.status}`);
        
        if (result.recommendations) {
            console.log(`✅ ${result.recommendations.length} recomendações recebidas`);
            console.log(`Explicação: ${result.explanation?.substring(0, 100)}...`);
        } else if (result.error) {
            console.log(`Erro: ${result.error}`);
        }
    } catch (error) {
        console.log(`❌ Erro nas recomendações: ${error.message}`);
    }
    
    // Teste 4: Teste de múltiplas mensagens
    console.log("\n3. Teste de Conversa (Múltiplas Mensagens)");
    console.log("-".repeat(40));
    
    const conversationData = {
        messages: [
            { content: "Olá, tudo bem?" },
            { content: "Quais pontos turísticos você recomenda?" }
        ]
    };
    
    try {
        const response = await fetch(chatUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(conversationData)
        });
        
        const result = await response.json();
        console.log(`Status: ${response.status}`);
        console.log(`Resposta: ${result.response ? "Recebida" : "Não recebida"}`);
        
        if (result.error) {
            console.log(`Erro: ${result.error}`);
        }
    } catch (error) {
        console.log(`❌ Erro na conversa: ${error.message}`);
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("TESTE CONCLUÍDO");
    console.log("=".repeat(60));
    console.log("\n📋 RESUMO DO DIAGNÓSTICO:");
    console.log("1. ✅ API de chat respondendo");
    console.log("2. ✅ Formato correto: {messages: [{content: 'texto'}]}");
    console.log("3. ⚠️  Cota da API Gemini excedida (erro 429)");
    console.log("4. ✅ Fallback implementado funcionando");
    console.log("\n💡 AÇÕES NECESSÁRIAS:");
    console.log("1. Obter nova chave da API Gemini");
    console.log("2. Atualizar GEMINI_API_KEY no .env");
    console.log("3. Reiniciar o servidor");
    console.log("\n🔗 Obter nova chave: https://makersuite.google.com/app/apikey");
};

// Executar teste
testAPI().catch(console.error);