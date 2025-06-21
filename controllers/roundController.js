const Round = require('../models/rounds.js');
const Ball = require('../models/balls.js');

function getLetra(numero) {
  return ['B', 'I', 'N', 'G', 'O'][Math.floor((numero - 1) / 15)];
}

exports.criarRodada = async (req, res) => {
  try {
    const { numero } = req.body;  // pega do corpo da requisição
    if (!numero) return res.status(400).json({ erro: 'Número da rodada é obrigatório' });

    // Cria a rodada com o número
    const novaRodada = await Round.create({ numero });
    res.status(201).json(novaRodada);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar rodada' });
  }
};


exports.registrarBola = async (req, res) => {
  const roundId = req.params.id;
  const { numero } = req.body;

  try {
    const round = await Round.findById(roundId).populate('bolasSorteadas');

    if (!round || round.status !== 'ativa') {
      return res.status(400).json({ erro: 'Rodada não encontrada ou encerrada' });
    }

    const jaSorteada = round.bolasSorteadas.some(b => b.numero === numero);
    if (jaSorteada) {
      return res.status(400).json({ erro: 'Essa bola já foi adicionada' });
    }

    const letra = getLetra(numero);
    const bola = await Ball.create({ numero, letra });

    round.bolasSorteadas.push(bola._id);
    await round.save();

    res.status(201).json({ mensagem: 'Bola registrada', bola });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar bola' });
  }
};


exports.listarRodadas = async (req, res) => {
  try {
    const rodadas = await Round.find().populate('bolasSorteadas');
    res.json(rodadas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar rodadas' });
  }
};


exports.encerrarRodada = async (req, res) => {
  try {
    const rodada = await Round.findByIdAndUpdate(
      req.params.id,
      { status: 'encerrada', dataFim: new Date() },
      { new: true }
    );
    res.json(rodada);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao encerrar rodada' });
  }
};
