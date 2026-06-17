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
        } else if(produto.user_id === req.user.id) {
            return res.status(400).json({error: 'Você não pode comprar seu prórpio produto!'});
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

        await prisma.notificacao.create({
            data: {
                user_id: produto.user_id,
                tipo: 'novo pedido',
                mensagem: `Você recebeu um novo pedido para "${produto.title}"!`
            }
        });

        await prisma.notificacao.create({
            data: {
                user_id: req.user.id,
                tipo: 'pedido realizado',
                mensagem: `Seu pedido para "${produto.title}" foi realizado com sucesso!`
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
                },
            },

            orderBy: {
                created_at: 'desc'
            }
        });

        return res.status(200).json(pedido);

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

const atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusPermitidos = ['confirmado', 'enviado', 'concluído', 'cancelado'];

  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({ error: `Status inválido. Use: ${statusPermitidos.join(', ')}` });
  }

  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: parseInt(id) },
      include: { produto: true }
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    if (pedido.produto.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Apenas o vendedor pode atualizar este pedido' });
    }

    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    if (status === 'concluído') {
      await prisma.produto.update({
        where: { id: pedido.produto_id },
        data: { status: 'vendido' }
      });

      await prisma.notificacao.create({
        data: {
          user_id: pedido.comprador_id,
          tipo: 'pedido_concluido',
          mensagem: `Seu pedido de "${pedido.produto.title}" foi concluído! Não esqueça de avaliar o vendedor.`
        }
      });
    }

    if (status === 'cancelado') {
      await prisma.produto.update({
        where: { id: pedido.produto_id },
        data: { status: 'disponível' }
      });

      await prisma.notificacao.create({
        data: {
          user_id: pedido.comprador_id,
          tipo: 'pedido_cancelado',
          mensagem: `Seu pedido de "${pedido.produto.title}" foi cancelado pelo vendedor.`
        }
      });
    }

    if (status === 'enviado') {
      await prisma.notificacao.create({
        data: {
          user_id: pedido.comprador_id,
          tipo: 'pedido_enviado',
          mensagem: `Seu pedido de "${pedido.produto.title}" foi enviado!`
        }
      });
    }

    return res.status(200).json({ message: 'Status atualizado com sucesso!', pedido: pedidoAtualizado });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
  }
};

const listaPedidosPorProduto = async (req, res) => {
    const {
        produto_id
    } = req.params;

    try {
        const pedidos = await prisma.pedido.findMany({
            where: {
                produto_id: parseInt(produto_id)
            },

            include: {
                comprador: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                }
            },
            
            orderBy: {
                created_at: 'desc'
            }
        });

        return res.status(200).json(pedidos);
    } catch(err) {
        console.log(err);
        return res.status(200).json({error: 'Erro ao listar pedidos'})
    }
};

module.exports = {
    criarPedido,
    listarPedido,
    buscarPedido,
    atualizarStatus,
    listaPedidosPorProduto
};