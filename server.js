const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = require('http').Server(app);
const io = socketIO(server);

// Nossa fila e a sessão atual
let fila = [];
let sessaoAtual = null;

// Servindo arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io handlers
io.on('connection', (socket) => {
    // Envia a fila e a sessão atual para o cliente quando se conecta
    socket.emit('fila', fila);
    socket.emit('sessaoAtual', sessaoAtual);

    // Handler para quando uma pessoa quer entrar na fila
    socket.on('entrarNaFila', (pessoa) => {
        // Adiciona a pessoa à fila e envia a fila atualizada para todos
        fila.push(pessoa);
        io.emit('fila', fila);
    });

    // Handler para quando uma pessoa quer começar a usar o banheiro
    socket.on('comecar', () => {
        // Se a sessão atual estiver vazia e a fila não estiver vazia, atualiza a sessão atual
        if (!sessaoAtual && fila.length > 0) {
            sessaoAtual = fila.shift();
            io.emit('sessaoAtual', sessaoAtual);
            io.emit('fila', fila);
        }
    });

    // Handler para quando uma pessoa quer finalizar a sessão
    socket.on('finalizarSessao', () => {
        // Se a sessão atual não estiver vazia, finaliza a sessão
        if (sessaoAtual) {
            sessaoAtual = null;
            io.emit('sessaoAtual', sessaoAtual);

            // Se a fila não estiver vazia, começa a próxima sessão
            if (fila.length > 0) {
                sessaoAtual = fila.shift();
                io.emit('sessaoAtual', sessaoAtual);
                io.emit('fila', fila);
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
