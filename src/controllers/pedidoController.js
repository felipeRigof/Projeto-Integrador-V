const prisma = require('../prisma/client');

const criarPedido = async(req, res) => {
    const {
        produto_id
    } = req.body;

    try {
        const produto = await prisma.produto.findUnique({
            where: {
                id: parseInt(produto_id)
            }
        });

        if(!produto) {
            return res.status(404).json({error: 'Produto não encontrado'});
        } else if(produto.status !== 'disponível') {
            return res.status(400).json({error: 'Produto não disponível'});
        }

        const pedido = await prisma.pedido.create({
            data: {
                comprador_id: req.user.id,
                produto_id: parseInt(produto_id),
                total: produto.price,
                status: 'Pendente'
            }
        });

        await prisma.produto.update({
            where: {
                id: parseInt(produto_id)
            },

            data: {
                status: 'reservado'
            }
        });

        return res.status(201).json({message: 'Pedido criado com sucesso!', pedido});

    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao criar o pedido!'});
    }
}

const listarPedido = async(req, res) => {
    try {
        const pedido = await prisma.pedido.findMany({
            where: {
                comprador_id: req.user.id
            },

            include: {
                produto: {
                    include: {
                        imagens: true
                    }
                }
            }
        });

        return res.status(200).json({pedido});

    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao listar os pedidos'});
    }
};

const buscarPedido = async(req, res) => {
    const {
        id
    } = req.params;

    try {
        const pedido = await prisma.pedido.findUnique({
            where: {
                id: parseInt(id)
            },

            include: {
                produto: {
                    include: {
                        imagens: true
                    }
                },

                comprador: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                }
            }
        });

        if(!pedido) {
            return res.status(404).json({error: 'Pedido não encontrado'});
        }

        return res.status(200).json(pedido);

    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao buscar pedido'});
    }
};

const atualizarStatus = async(req, res) => {
    const {
        id
    } = req.params;

    const {
        status
    } = req.body;

    try {
        const pedido = await prisma.pedido.update({
            where: {
                id: parseInt(id)
            },

            data: {
                status
            }
        });

        if(status === 'concluído') {
            await prisma.produto.update({
                where: {
                    id: pedido.produto_id
                },

                data: {
                    status: 'vendido'
                }
            });
        }

        return res.status(200).json({message: 'Status atualizado com sucesso', pedido});

    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao atualizar status do pedido'});
    }
};

module.exports = {
    criarPedido,
    listarPedido,
    buscarPedido,
    atualizarStatus
};