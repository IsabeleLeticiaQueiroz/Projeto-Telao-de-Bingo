// bingo.js
const urlParams = new URLSearchParams(window.location.search);
const roundId = urlParams.get('rodada');

function letraPorNumero(numero) {
  if (numero >= 1 && numero <= 15) return 'B';
  if (numero >= 16 && numero <= 30) return 'I';
  if (numero >= 31 && numero <= 45) return 'N';
  if (numero >= 46 && numero <= 60) return 'G';
  if (numero >= 61 && numero <= 75) return 'O';
  return '';
}


// Função para criar a tabela dos números com as classes de cor
function criarTabelaBingo() {
  const colunas = [
    { letra: 'B', min: 1, max: 15, cor: 'vermelho' },
    { letra: 'I', min: 16, max: 30, cor: 'amarelo' },
    { letra: 'N', min: 31, max: 45, cor: 'verde' },
    { letra: 'G', min: 46, max: 60, cor: 'azul' },
    { letra: 'O', min: 61, max: 75, cor: 'roxo' }
  ];

  const container = document.createElement('div');
  container.id = 'numeros';

  colunas.forEach(({ letra, min, max, cor }) => {
    const table = document.createElement('table');
    table.id = cor;

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    const th = document.createElement('th');
    th.colSpan = 2;
    th.textContent = letra;
    trHead.appendChild(th);
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    // cada linha com 2 números, exceto última com 1
    let currentNum = min;
    while (currentNum <= max) {
      const tr = document.createElement('tr');
      for (let i = 0; i < 2; i++) {
        const td = document.createElement('td');
        if (currentNum <= max) {
          td.classList.add('cinza');
          td.textContent = currentNum;
          // adiciona evento clique e duplo clique
          td.addEventListener('click', () => cliqueNumero(td));
          td.addEventListener('dblclick', () => descliqueNumero(td));
          currentNum++;
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);
  });

  document.body.appendChild(container);
}

// Atualiza a cor da bola maior e menor conforme o número
function trocarCor(onde, num) {
  const el = document.getElementById(onde + '-bola');
  el.className = ''; // limpa classes

  if (num > 0 && num <= 15) {
    el.classList.add('vermelho');
    el.querySelector('strong').textContent = 'B';
  } else if (num > 15 && num <= 30) {
    el.classList.add('amarelo');
    el.querySelector('strong').textContent = 'I';
  } else if (num > 30 && num <= 45) {
    el.classList.add('verde');
    el.querySelector('strong').textContent = 'N';
  } else if (num > 45 && num <= 60) {
    el.classList.add('azul');
    el.querySelector('strong').textContent = 'G';
  } else if (num > 60 && num <= 75) {
    el.classList.add('roxo');
    el.querySelector('strong').textContent = 'O';
  } else {
    el.querySelector('strong').textContent = '-';
    el.querySelector('span').textContent = '-';
  }
}

function trocarBolaMaior(num) {
  const el = document.getElementById('ultima-bola');
  el.querySelector('span').textContent = num;
  trocarCor('ultima', num);
}

function trocarBolaMenor(num) {
  const el = document.getElementById('penultima-bola');
  el.querySelector('span').textContent = num;
  trocarCor('penultima', num);
}

let ultimoSelecionado = null;
let penultimoSelecionado = null;

// Função que roda ao clicar em um número
async function cliqueNumero(td) {
  if (td.classList.contains('ultimo')) {
    // Confirmar desclicar (remover)
    if (confirm(`Confirma desclicar número ${td.textContent}?`)) {
      td.classList.remove('ultimo');
      td.classList.add('cinza');

      // Atualiza bolas maior e menor
      if (penultimoSelecionado) {
        trocarBolaMaior(penultimoSelecionado.textContent);
        penultimoSelecionado.classList.add('ultimo');
      }
      trocarBolaMenor(0);

      // Atualiza variáveis
      ultimoSelecionado = penultimoSelecionado;
      penultimoSelecionado = null;

      // Remove do banco
      await removerNumeroBanco(td.textContent);
    }
  } else {
    td.classList.remove('cinza');

    if (penultimoSelecionado) penultimoSelecionado.classList.remove('penultimo');
    if (ultimoSelecionado) {
      ultimoSelecionado.classList.add('sorteado', 'penultimo');
      ultimoSelecionado.classList.remove('ultimo');
      penultimoSelecionado = ultimoSelecionado;
    }

    td.classList.add('ultimo');

    trocarBolaMaior(td.textContent);
    if (penultimoSelecionado) {
      trocarBolaMenor(penultimoSelecionado.textContent);
    } else {
      trocarBolaMenor(0);
    }

    // Atualiza variáveis
    ultimoSelecionado = td;

    // Salva no banco
    await salvarNumeroBanco(td.textContent);
  }
}

// Função que roda no duplo clique — remove o número do banco e atualiza UI
async function descliqueNumero(td) {
  if (!td.classList.contains('cinza')) {
    if (confirm(`Confirma desclicar número ${td.textContent} no duplo clique?`)) {
      td.classList.remove('ultimo', 'penultimo', 'sorteado');
      td.classList.add('cinza');

      if (ultimoSelecionado === td) ultimoSelecionado = null;
      if (penultimoSelecionado === td) penultimoSelecionado = null;

      // Atualiza bolas maior e menor, simplificando
      trocarBolaMaior(ultimoSelecionado ? ultimoSelecionado.textContent : 0);
      trocarBolaMenor(penultimoSelecionado ? penultimoSelecionado.textContent : 0);

      // Remove do banco
      await removerNumeroBanco(td.textContent);
    }
  }
}

// Função para salvar número no banco via API
async function salvarNumeroBanco(numero) {
  if (!roundId) {
    alert('Rodada não definida');
    return;
  }

  const letra = letraPorNumero(Number(numero));

  const res = await fetch(`/api/rounds/${roundId}/registrar`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ numero: Number(numero) })
});


  if (!res.ok) {
    const error = await res.json();
    console.error('Erro ao salvar número:', error.error);
    return;
  }

  console.log(`Número ${numero} salvo na rodada ${roundId}.`);
}


// Função para remover número do banco via API
async function removerNumeroBanco(numero) {
  try {
    await fetch(`/api/balls/${numero}`, {
      method: 'DELETE'
    });
    console.log(`Número ${numero} removido do banco.`);
  } catch (err) {
    console.error('Erro ao remover número do banco:', err);
  }
}

// Função para criar os elementos da seção das bolas maior e menor
function criarSecaoBolas() {
  const bolasDiv = document.createElement('div');
  bolasDiv.id = 'bolas';

  ['ultima', 'penultima'].forEach((onde) => {
    const p = document.createElement('p');
    p.id = onde + '-bola';

    const strong = document.createElement('strong');
    strong.textContent = '-';

    const span = document.createElement('span');
    span.textContent = '-';

    p.appendChild(strong);
    p.appendChild(span);
    bolasDiv.appendChild(p);
  });

  document.body.appendChild(bolasDiv);
}

document.getElementById('btn-encerrar').addEventListener('click', async () => {
  if (!roundId) {
    alert('Rodada não definida!');
    return;
  }

  if (confirm('Deseja encerrar esta rodada?')) {
    const res = await fetch(`/api/rounds/${roundId}/finalizar`, {
      method: 'PATCH'
    });

    if (res.ok) {
      alert('Rodada encerrada!');
      // Redireciona para a página inicial de escolher rodada
      window.location.href = 'index.html';
    } else {
      alert('Erro ao encerrar rodada.');
    }
  }
});



// Inicializa o bingo
function init() {
  criarTabelaBingo();
  criarSecaoBolas();

  // Colocar aqui mais inicializações se precisar
}

window.onload = init;
