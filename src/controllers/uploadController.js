const {
    cloudinary
} = require('../config/cloudinary');
const prisma = require('../prisma/client');

const uploadImagem = async (req, res) => {
    const {
        produto_id
    } = req.params;

    try {
        if(!req.file) {
            return res.status(400).json({error: 'Nenhuma imagem enviado'});
        }

        const imagem = await prisma.produto_img.create({
            data: {
                prdutos_id: parseInt(produto_id),
                image_url: req.file.path || req.file.secure_url
            }
        });

        return res.status(201).json({message: 'Imagem enviada com sucesso!', imagem});
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Não foi possível enviar a imagem'});
    }
};

const deletaImagem = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const imagem = await prisma.produto_img.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if(!imagem) {
            return res.status(404),json({error: 'Imagem não encontrada'});
        }

        const publicId = imagem.imagem_url.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        await prisma.produto_img.delete({
            where: {
                id: parseInt(id)
            }
        });

        return res.status(200).json({message: 'Imagem deletada com sucesso!'});
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao deletar a imagem'});
    }
};

module.exports = {
    uploadImagem,
    deletaImagem
}