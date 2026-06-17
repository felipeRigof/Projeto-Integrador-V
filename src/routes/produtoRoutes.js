const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

const {
    listarProduto,
    buscarProduto,
    cadastrarProduto,
    atualizarProduto,
    deletarProduto,
    listarMeusProdutos
} = require('../controllers/produtoController');

router.get('/', listarProduto);
router.get('/meus', authenticate, listarMeusProdutos);
router.get('/:id', buscarProduto);
router.post('/', authenticate, cadastrarProduto);
router.put('/:id', authenticate, atualizarProduto);
router.delete('/:id', authenticate, deletarProduto);

module.exports = router;