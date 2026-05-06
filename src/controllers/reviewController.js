const prisma = require('../prisma/client');

const criaReview = async(req, res) => {
    const {
        reviewed_id,
        pedido_id,
        rating,
        comentario
    } = req.body;

    try {
        const pedido = await prisma.pedido.findUnique({
            where: {
                id: parseInt(pedido_id)
            }
        });

        if(!pedido) {
            return res.status(404).json({error: 'Pedido não encontrado'});
        }

        if(pedido.comprador_id !== req.user.id) {
            return res.status(403).json({error: 'Você não pode avaliar este pedido'});
        }

        const reviewExistente = await prisma.review.findFirst({
            where: {
                pedido_id: parseInt(pedido_id) 
            }
        });

        if(reviewExistente) {
            return res.status(403).json({error: 'Esse pedido já foi avaliado'});
        }

        const avaliacao = await prisma.review.create({
            data: {
                reviewer_id: req.user.id,
                reviewed_id: parseInt(reviewed_id),
                pedido_id: parseInt(pedido_id),
                rating: parseInt(rating),
                comentario
            }
        });

        return res.status(200).json({message: 'Avaliação realizada com sucesso!', avaliacao});

    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao criar avalaiação'});
    }
};

const listaReview = async(req,res) => {
    const {
        user_id
    } = req.params;

    try {
        const avaliacao = await prisma.review.findMany({
            where: {
                reviewed_id: parseInt(user_id)
            },
            
            include: {
                reviewer: {
                    select: {
                        id: true,
                        nome: true
                    }
                },

                orderBy: {
                    created_at: 'desc'
                }
            }
        });

        const media = avaliacao.length > 0 ? avaliacao.reduce((acc, av) => acc + av.rating, 0) / avaliacao.length : 0;

        return res.status(200).json({media: media.toFixed(1), total: avaliacao.length, avaliacao
        });

    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao listar avaliações'});
    }
};

const minhaReview = async(req, res) => {
    try {
        const avaliacao = await prisma.review.findMany({
            where: {
                reviewer_id: req.user.id
            },

            include: {
                reviewed: {
                    select: {
                        id: true, nome: true
                    }
                },

                pedido: true
            },

            orderBy: {
                created_at: 'desc'
            }
        });

        return res.status(200).json(avaliacao);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao listar suas avaliações'});
    }
};

module.exports = {
    criaReview,
    listaReview,
    minhaReview
};