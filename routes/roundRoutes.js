const express = require('express');
const router = express.Router();
const roundController = require('../controllers/roundController.js');

router.post('/rounds', roundController.criarRodada);
router.post('/rounds/:id/registrar', roundController.registrarBola); // 👈 nome novo
router.patch('/rounds/:id/finalizar', roundController.encerrarRodada);
router.get('/rounds', roundController.listarRodadas);

module.exports = router;
