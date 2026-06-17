const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const {
    upload
} = require('../config/cloudinary');
const {
    uploadImagem,
    deletaImagem
} = require('../controllers/uploadController');

router.post('/:produto_id', authenticate, upload.single('imagem'), uploadImagem);
router.delete('/:id', authenticate, deletaImagem);

module.exports = router;