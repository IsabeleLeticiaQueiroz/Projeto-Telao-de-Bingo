const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');          
const roundRoutes = require('./routes/roundRoutes.js');
const ballRoutes = require('./routes/ballRoutes.js');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', roundRoutes);
app.use('/api', ballRoutes);

app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MongoDB
mongoose.connect('mongodb+srv://bbelequeiroz:123@cluster0.kvvllwx.mongodb.net/bingo?retryWrites=true&w=majority&appName=Cluster0', {
}).then(() => {
  console.log('✅ MongoDB conectado');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Erro ao conectar no MongoDB:', err);
});
