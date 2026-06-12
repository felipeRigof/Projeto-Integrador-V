require('dotenv').config();

const express = require('express');
const cors = require('cors');
const prisma = require('./prisma/client');

const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificacaoRoutes = require('./routes/notificacaoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/review', reviewRoutes);
app.use('/notificacoes', notificacaoRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Brechó Solidário funcionando! 🧺' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});