const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

const {
    criarPedido,
    listarPedido,
    buscarPedido,
    atualizarStatus
} = require('../controllers/pedidoController');

router.post('/', authenticate, criarPedido);
router.get('/', authenticate, listarPedido);
router.get('/:id', authenticate, buscarPedido);
router.put('/:id', authenticate, atualizarStatus);

module.exports = router;