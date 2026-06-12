/* ---------cadastro---------- */
const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {

        console.log('chegou no register');
        console.log('body:', req.body);
    const {
        nome,
        email,
        password,
        num_telefone,
        city
    } = req.body;

    try {
        const existingUser = await prisma.users.findUnique({
            where: {
                email
            }
        });

        if(existingUser) {
            return res.status(400).json({error: 'E-mail já cadastrado'});
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await prisma.users.create ({
            data: {
                nome,
                email,
                password_hash,
                num_telefone,
                city
            }
        });

        return res.status(201).json ({
            message: 'Cadastrado com sucesso!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Erro ao cadastrar usuário'});
    }
};

/* ---------login---------- */
const login = async(req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        });

        if(!user) {
            return res.status(401).json({error: 'E-mail ou senha incorretos'});
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if(!passwordMatch) {
            return res.status(401).json({error: 'Senha incorreta'});
        }

        const token = jwt.sign (
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'Login realizado com sucesso', token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        });

    } catch (err) {
        return res.status(500).json({error: 'Erro ao realizar login'});
    }
};

module.exports = { register, login };