const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true,
    unique: true
  },
  dataInicio: {
    type: Date,
    default: Date.now
  },
  dataFim: {
    type: Date
  },
  bolasSorteadas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ball'
  }],
  status: {
    type: String,
    enum: ['ativa', 'encerrada'],
    default: 'ativa'
  }
});

module.exports = mongoose.model('Round', roundSchema);
