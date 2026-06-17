const prisma = require('../prisma/client');

const listaUsuario = async (req, res) => {
    try {
        const usuario = await prisma.users.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                citty: true,
                num_telefone: true,
                created_at: true
            }
        });

        return res.status(200).json(usuario);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao listar usuários'});
    }
};

const buscaUsuario = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const usuario = await prisma.users.findUnique({
            where: {
                id: parseInt(id)
            },

            select: {
                id: true,
                nome: true,
                email: true,
                city: true,
                num_telefone: true,
                created_at: true
            }
        });

        if(!usuario) {
            return res.status(404).json({error: 'Usuário não encontrado'});
        }

        return res.status(200).json({usuario});
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao buscar usuário'});
    }
}

const meuPerfil = async (req, res) => {
    try {
        const usuario = await prisma.users.findUnique({
            where: {
                id: req.user.id
            },

            select: {
                id: true,
                nome: true,
                email: true,
                city: true,
                num_telefone: true,
                created_at: true
            }
        });

        return res.status(200).json(usuario);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao buscar perfil'});
    }
}

const atualizaPerfil = async (req, res) => {
    const {
        nome,
        city,
        num_telefone
    } = req.body;

    try {
        const usuario = await prisma.users.update({
            where: {
                id: req.user.id
            },

            data: {
                nome,
                city,
                num_telefone
            },

            select: {
                id: true,
                nome: true,
                email: true,
                city: true,
                num_telefone: true
            }
        });

        return res.status(200).json({message: 'Perfil atualizado com sucesso!', user: usuario});
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao atualizar o perfil'});
    }
};

module.exports = {
    listaUsuario,
    buscaUsuario,
    meuPerfil,
    atualizaPerfil
}