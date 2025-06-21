const mongoose = require('mongoose');

const ballSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true,
    min: 1,
    max: 75
  },
  letra: {
    type: String,
    enum: ['B', 'I', 'N', 'G', 'O'],
    required: true
  },
  sorteadaEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ball', ballSchema);
