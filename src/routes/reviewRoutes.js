const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

const { 
    criaReview, 
    listaReview ,
    minhaReview
} = require('../controllers/reviewController');

router.post('/', authenticate, criaReview);
router.get('/minha', authenticate, minhaReview);
router.get('/usuario/:user_id', listaReview);

module.exports = router;