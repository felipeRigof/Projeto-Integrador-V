const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

const {
    listaNotificacao,
    marcaComoLida,
    marcaTodasComoLida,
    excluiNotificacao
} = require('../controllers/notificacaoController');

router.get('/', authenticate, listaNotificacao);
router.put('/todas', authenticate, marcaTodasComoLida);
router.put('/:id', authenticate, marcaComoLida);
router.delete('/:id', authenticate, excluiNotificacao);

module.exports = router;