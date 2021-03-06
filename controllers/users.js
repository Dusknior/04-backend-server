const { response } = require('express');
const bcrypt = require('bcryptjs')
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async(req, res) => {

    const from = Number(req.query.from) || 0;
    const to = Number(req.query.to);

    const [users, total] = await Promise.all([
        User.find({}, 'name email role google').skip(from).limit(to + 1),
        User.count(),
    ])

    return res.json({
        ok: true, 
        users,
        total
    });
}

const createUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const validateEmail = await User.findOne({ email });

        if(validateEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email already exists'
            })
        }

        const user = new  User(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        //Guardar usuario
        await user.save()

        //Generar y devolver token
        const token = await generateJWT(user.id);
    
        return res.json({
            ok: true, 
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Unexpected error...check logs'
        });
    }   
}

const updateUser = async(req, res = response) => {
    //TODO: Validar token y comprobar si el usuario es el mismo que esta actualizando

    const uid = req.params.id

    try {

        const userDB = await User.findById(uid);

        if(!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User not found'
            })
        }
        
        //Actualizar usuario
        const {password, google, email, ...campos} = req.body

        if (userDB.email !== email) { 
            const validateEmail = await User.findOne({ email });
            if(validateEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email already exists'
                })
            }
        }      
        
        campos.email = email
        
        const updatedUser = await User.findByIdAndUpdate(uid, campos, { new: true });


        return res.json({
            ok: true,
            updatedUser
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Unexpected error...check logs'
        });
    }
}

const deleteUser = async(req, res = response) => {

    const uid = req.params.id

    try {

        const userDB = await User.findById(uid);

        if(!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User not found'
            })
        }
        
       await User.findByIdAndRemove(uid);

       return res.json({
            ok: true,
            msg: 'User deleted successfully'
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Unexpected error...check logs'
        });
    }
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}
