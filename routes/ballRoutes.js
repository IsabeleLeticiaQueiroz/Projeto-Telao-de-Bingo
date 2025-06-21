const express = require('express');
const Ball = require('../models/balls.js');
const router = express.Router();

function getLetra(numero) {
  return ['B', 'I', 'N', 'G', 'O'][Math.floor((numero - 1) / 15)];
}

// Criar/salvar bola sorteada — se já existir, retorna ok para evitar erro front
router.post('/balls', async (req, res) => {
  console.log('🔔 Requisição recebida em /balls:', req.body); // 👈 Aqui

  try {
    const { numero, letra } = req.body;
    if (!numero || !letra) return res.status(400).json({ error: 'Número e letra são obrigatórios' });

    const exists = await Ball.findOne({ numero });
    if (exists) {
      return res.status(200).json({ message: 'Número já registrado' });
    }

    const ball = new Ball({ numero, letra });
    await ball.save();
    res.status(201).json(ball);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Remover bola pelo número
router.delete('/balls/:numero', async (req, res) => {
  try {
    const { numero } = req.params;
    const deleted = await Ball.findOneAndDelete({ numero });
    if (!deleted) return res.status(404).json({ error: 'Número não encontrado' });

    res.json({ message: 'Número removido', numero: deleted.numero });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
