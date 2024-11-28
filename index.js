const WebSocket = require('ws');

// Cria o servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });

let mensagens = []; // Para armazenar o histórico de mensagens

console.log('Servidor WebSocket rodando na porta 8080');

// Evento de conexão com o cliente
wss.on('connection', (ws) => {
    console.log('Novo cliente conectado.');

    // Envia o histórico de mensagens ao novo cliente
    ws.send(JSON.stringify({ tipo: 'historico', mensagens }));

    // Recebe mensagens dos clientes
    ws.on('message', (message) => {
        console.log(`Mensagem recebida: ${message}`);

        // Adiciona a mensagem ao histórico
        mensagens.push(message);

        // Envia a mensagem para todos os clientes conectados
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ tipo: 'novaMensagem', mensagem: message }));
            }
        });
    });

    // Evento de desconexão
    ws.on('close', () => {
        console.log('Cliente desconectado.');
    });
});
