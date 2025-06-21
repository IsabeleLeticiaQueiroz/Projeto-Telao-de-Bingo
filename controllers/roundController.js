const Round = require('../models/rounds.js');
const Ball = require('../models/balls.js');

function getLetra(numero) {
  return ['B', 'I', 'N', 'G', 'O'][Math.floor((numero - 1) / 15)];
}

exports.criarRodada = async (req, res) => {
  try {
    const { numero } = req.body;
    if (!numero) {
      return res.status(400).json({ erro: 'Número da rodada é obrigatório' });
    }

    const existe = await Round.findOne({ numero });
    if (existe) {
      return res.status(409).json({ erro: 'Número da rodada já existe' });
    }

    const novaRodada = await Round.create({ numero });
    return res.status(201).json(novaRodada);
  } catch (err) {
    console.error('Erro criar rodada:', err);
    return res.status(500).json({ erro: 'Erro ao criar rodada' });
  }
};

exports.registrarBola = async (req, res) => {
  const roundId = req.params.id;
  const { numero } = req.body;

  if (!numero) {
    return res.status(400).json({ erro: 'Número da bola é obrigatório' });
  }

  try {
    const round = await Round.findById(roundId).populate('bolasSorteadas');

    if (!round) {
      return res.status(404).json({ erro: 'Rodada não encontrada' });
    }

    if (round.status !== 'ativa') {
      return res.status(400).json({ erro: 'Rodada encerrada' });
    }

    const jaSorteada = round.bolasSorteadas.some(b => b.numero === numero);
    if (jaSorteada) {
      return res.status(409).json({ erro: 'Essa bola já foi adicionada' });
    }

    const letra = getLetra(numero);
    const bola = await Ball.create({ numero, letra });

    round.bolasSorteadas.push(bola._id);
    await round.save();

    return res.status(201).json({ mensagem: 'Bola registrada', bola });
  } catch (err) {
    console.error('Erro registrar bola:', err);
    return res.status(500).json({ erro: 'Erro ao registrar bola' });
  }
};

exports.listarRodadas = async (req, res) => {
  try {
    const rodadas = await Round.find().populate('bolasSorteadas');
    return res.json(rodadas);
  } catch (err) {
    console.error('Erro listar rodadas:', err);
    return res.status(500).json({ erro: 'Erro ao listar rodadas' });
  }
};

exports.encerrarRodada = async (req, res) => {
  const roundId = req.params.id;
  try {
    const rodada = await Round.findById(roundId);

    if (!rodada) {
      return res.status(404).json({ erro: 'Rodada não encontrada' });
    }

    if (rodada.status === 'encerrada') {
      return res.status(400).json({ erro: 'Rodada já está encerrada' });
    }

    rodada.status = 'encerrada';
    rodada.dataFim = new Date();
    await rodada.save();

    return res.json(rodada);
  } catch (err) {
    console.error('Erro encerrar rodada:', err);
    return res.status(500).json({ erro: 'Erro ao encerrar rodada' });
  }
};
