// Teste da API de IA Txopela
const testChatAPI = async () => {
    console.log("=".repeat(50));
    console.log("TESTE DA API DE CHAT TXOPELA");
    console.log("=".repeat(50));
    
    const url = "http://localhost:8000/api/ai/chat/";
    
    // Teste 1: Formato correto (baseado na view)
    const testData1 = {
        messages: [
            { content: "Olá, teste da assistente" }
        ]
    };
    
    // Teste 2: Formato alternativo (baseado no test_chat_api.py)
    const testData2 = {
        message: "Olá, teste da assistente"
    };
    
    // Teste 3: Com múltiplas mensagens
    const testData3 = {
        messages: [
            { content: "Olá" },
            { content: "Quais são os melhores pontos turísticos?" }
        ]
    };
    
    const tests = [
        { name: "Formato correto (messages array)", data: testData1 },
        { name: "Formato alternativo (message string)", data: testData2 },
        { name: "Múltiplas mensagens", data: testData3 }
    ];
    
    for (const test of tests) {
        console.log(`\n📋 Teste: ${test.name}`);
        console.log(`📤 Dados: ${JSON.stringify(test.data)}`);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(test.data)
            });
            
            console.log(`📥 Status: ${response.status}`);
            
            if (response.ok) {
                const result = await response.json();
                console.log(`✅ Resposta: ${JSON.stringify(result, null, 2)}`);
            } else {
                const errorText = await response.text();
                console.log(`❌ Erro: ${errorText}`);
            }
        } catch (error) {
            console.log(`❌ Erro de conexão: ${error.message}`);
        }
        
        console.log("-".repeat(50));
    }
    
    // Teste adicional: Verificar se o servidor está rodando
    console.log("\n🌐 Verificando status do servidor...");
    try {
        const healthResponse = await fetch("http://localhost:8000/");
        console.log(`Servidor status: ${healthResponse.status}`);
    } catch (error) {
        console.log(`❌ Servidor não responde: ${error.message}`);
    }
};

// Executar o teste
testChatAPI().catch(console.error);