const socket = io.connect('http://localhost:3000');
const formFila = document.getElementById('formFila');
const btnComecar = document.getElementById('btnComecar');
const btnFinalizar = document.getElementById('btnFinalizar');
const listaFila = document.getElementById('fila');
const sessaoAtualDiv = document.getElementById('sessaoAtual');

// Quando o cliente se conecta, registra os handlers para os eventos da fila e da sessão
socket.on('fila', atualizarFila);
socket.on('sessaoAtual', atualizarSessaoAtual);

formFila.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const tempo = document.getElementById('tempo').value;

    // Emitir o evento 'entrarNaFila' com os dados da pessoa
    socket.emit('entrarNaFila', { nome, tempo });
});

btnComecar.addEventListener('click', () => {
    // Emitir o evento 'comecar'
    socket.emit('comecar');
});

btnFinalizar.addEventListener('click', () => {
    // Emitir o evento 'finalizarSessao'
    socket.emit('finalizarSessao');
});

function atualizarFila(fila) {
    // Limpar a lista da fila
    listaFila.innerHTML = '';

    // Adicionar cada pessoa na fila à lista
    fila.forEach((pessoa, i) => {
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${pessoa.nome} - ${pessoa.tempo} minutos`;
        listaFila.appendChild(li);
    });

    // Habilitar o botão 'Começar' se a fila não estiver vazia
    btnComecar.disabled = fila.length === 0;
}

function atualizarSessaoAtual(sessaoAtual) {
    if (sessaoAtual) {
        sessaoAtualDiv.textContent = `${sessaoAtual.nome} - ${sessaoAtual.tempo} minutos`;
        btnFinalizar.disabled = false;
    } else {
        sessaoAtualDiv.textContent = 'Ninguém';
        btnFinalizar.disabled = true;
    }
}
