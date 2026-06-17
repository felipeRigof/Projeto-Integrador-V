const prisma = require('../prisma/client');

/* -----listagem dos produtos disponíveis----- */
const listarProduto = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: { status: 'disponível' },
      include: {
        categoria: true,
        imagens: true,
        user: { select: { id: true, nome: true, city: true } }
      }
    });
    return res.status(200).json(produtos);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

const listarMeusProdutos = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: { user_id: req.user.id }, // sem filtro de status
      include: {
        categoria: true,
        imagens: true,
        user: { select: { id: true, nome: true, city: true } }
      }
    });
    return res.status(200).json(produtos);
  } catch(err) {
    return res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

const buscarProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true,
        imagens: true,
        user: { select: { id: true, nome: true, city: true } }
      }
    });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.status(200).json(produto);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

const cadastrarProduto = async(req, res) => {
    const {
        title,
        description,
        category,
        conditions,
        type,
        price,
        categoria_id
    } = req.body;

    try {
        const produto = await prisma.produto.create({
            data: {
                user_id: req.user.id,
                title,
                description,
                category,
                conditions,
                type,
                
                price: price ? parseFloat(price) : null,
                categoria_id: categoria_id ? parseInt(categoria_id) : null
            }
        });

        return res.status(201).json({message: 'Produto cadastrado com sucesso!', produto});

    } catch(err) {
        return res.status(500).json({error: 'Erro ao cadastrar o produto!'});
    }
};

const atualizarProduto = async(req, res) => {
    const {
        id
    } = req.params;

    const {
        title,
        description,
        category,
        conditions,
        type,
        price,
        status
    } = req.body;

    try {
        const produto = await prisma.produto.update({
            where: {
                id: parseInt(id)
            },

            data: {
                title,
                description,
                category,
                conditions,
                type,
                price,
                status
            }
        });

        return res.status(200).json({message: 'Produto atualizado com sucesso!'});
    } catch(err) {
        return res.status(500).json({error: 'Erro ao atualizar o produto!'});
    }
};

const deletarProduto = async(req, res) => {
    const {
        id
    } = req.params;

    try {
        await prisma.produto.delete({
            where: {
                id: parseInt(id)
            }
        });

        return res.status(200).json({message: 'Produto excluído com sucesso!'});

    } catch(err) {
        return res.status(500).json({error: 'Erro ao excluir o produto!'});
    }
}

module.exports = {
    listarProduto,
    buscarProduto,
    listarMeusProdutos,
    cadastrarProduto,
    atualizarProduto,
    deletarProduto
};