const express = require('express');
const router = express.Router();
const {
    listaCategoria,
    buscaCategoria
} = require('../controllers/categoriaController');

router.get('/', listaCategoria);
router.get('/:id', buscaCategoria);

module.exports = router;