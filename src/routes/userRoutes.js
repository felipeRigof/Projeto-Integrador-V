const express = require('express');
const router = express.router();
const authenticate = require('../middlewares/authMiddleware');

const {
    listaUsuario,
    buscaUsuario,
    meuPerfil,
    atualizaPerfil
} = require('../controllers/userController');

router.put('/perfil', authenticate, atualizaPerfil);