const prisma = require('../prisma/client');

const listaCategoria = async(req, res) => {
    try {
        const categorias = await prisma.categorias.findMany({
            orderBy: {
                nome: 'asc'
            }
        });

        return res.status(200).json({categorias});

    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao listar categorias'});
    }
};

const buscaCategoria = async(req, res) => {
    const {
        id
    } = req.params;

    try {
        const categorias = await prisma.categorias.findUnique({
            where: {
                id: parseInt(id)
            },

            include: {
                produtos: true
            }
        });

        if(!categorias) {
            return res.status(404).json({error: 'Categoria não encontrada'});
        }

        return res.status(200).json({categorias});

    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao buscar categoria'});
    }
};


module.exports = {
    listaCategoria,
    buscaCategoria
};