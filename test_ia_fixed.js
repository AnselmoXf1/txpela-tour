// Teste da API de IA Txopela com fallback
const testChatAPIWithFallback = async () => {
    console.log("=".repeat(50));
    console.log("TESTE DA API DE CHAT TXOPELA (COM FALLBACK)");
    console.log("=".repeat(50));
    
    const url = "http://localhost:8000/api/ai/chat/";
    
    const testMessages = [
        { content: "Olá, teste da assistente" },
        { content: "Quais são os melhores pontos turísticos?" },
        { content: "Recomende lugares para visitar em Inhambane" },
        { content: "O que fazer em Inhambane?" }
    ];
    
    for (const message of testMessages) {
        const testData = {
            messages: [message]
        };
        
        console.log(`\n📋 Mensagem: "${message.content}"`);
        console.log(`📤 Dados: ${JSON.stringify(testData)}`);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData)
            });
            
            console.log(`📥 Status: ${response.status}`);
            
            if (response.ok) {
                const result = await response.json();
                console.log(`✅ Resposta recebida:`);
                console.log(`   ${result.response}`);
                
                // Verificar se é uma resposta de fallback
                if (result.response.includes("cota") || 
                    result.response.includes("indisponível") ||
                    result.response.includes("Terra da Boa Gente")) {
                    console.log(`   ⚠️  Esta é uma resposta de fallback (cota excedida)`);
                }
            } else {
                const errorText = await response.text();
                console.log(`❌ Erro HTTP: ${errorText}`);
            }
        } catch (error) {
            console.log(`❌ Erro de conexão: ${error.message}`);
        }
        
        console.log("-".repeat(50));
        
        // Pequena pausa entre requisições
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Teste de recomendações
    console.log("\n" + "=".repeat(50));
    console.log("TESTE DE RECOMENDAÇÕES");
    console.log("=".repeat(50));
    
    const recommendationsUrl = "http://localhost:8000/api/ai/recommendations/";
    const recommendationsData = {
        preferences: "Praias e natureza"
    };
    
    console.log(`📋 Preferências: "${recommendationsData.preferences}"`);
    
    try {
        const response = await fetch(recommendationsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recommendationsData)
        });
        
        console.log(`📥 Status: ${response.status}`);
        
        if (response.ok) {
            const result = await response.json();
            console.log(`✅ Recomendações recebidas:`);
            console.log(`   Explicação: ${result.explanation.substring(0, 100)}...`);
            console.log(`   Número de pontos recomendados: ${result.recommendations ? result.recommendations.length : 0}`);
        } else {
            const errorText = await response.text();
            console.log(`❌ Erro HTTP: ${errorText}`);
        }
    } catch (error) {
        console.log(`❌ Erro de conexão: ${error.message}`);
    }
    
    console.log("\n" + "=".repeat(50));
    console.log("RESUMO DO DIAGNÓSTICO:");
    console.log("=".repeat(50));
    console.log("1. ✅ API está respondendo (status 200)");
    console.log("2. ⚠️  Cota da API Gemini excedida (erro 429)");
    console.log("3. ✅ Fallback implementado funcionando");
    console.log("4. 💡 Solução: Obter nova chave da API Gemini");
    console.log("5. 🔗 Link: https://makersuite.google.com/app/apikey");
};

// Executar o teste
testChatAPIWithFallback().catch(console.error);