const prisma = require('../prisma/client');

const listaNotificacao = async (req, res) => {
    try {
        const notificacao = await prisma.notificacao.findMany({
            where: {
                user_id: req.user.id
            },
            
            orderBy: {
                created_at: 'desc'
            }
        });

        return res.status(200).json(notificacao);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao listar notificações'});
    }
};

const marcaComoLida = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const notificacao = await prisma.notificacao.update({
            where: {
                id: parseInt(id)
            },

            data: {
                lido: true
            }
        });

        return res.status(200).json({message: 'Mensagem marcada como lida!', notificacao});
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao atualizar notificação'});
    }
};

const marcaTodasComoLida = async (req, res) => {
    try {
        const notificacao = await prisma.notificacao.updateMany({
            where: {
                user_id: req.user.id,
                lido: false
            },

            data: {
                lido: true
            }
        });

        return res.status(200).json({message: 'Todas as notificações foram marcadas como lidas!', notificacao});
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao marcar todas as notificações como lidas'});
    }
};

const excluiNotificacao = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const notificacao = await prisma.notificacao.delete({
            where: {
                id: parseInt(id)
            }
        });

        return res.status(200).json({message: 'Notificação excluída com sucesso!', notificacao});
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao excluir notificação'});
    }
};

module.exports = {
    listaNotificacao,
    marcaComoLida,
    marcaTodasComoLida,
    excluiNotificacao
};