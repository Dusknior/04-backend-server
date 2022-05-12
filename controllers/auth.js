const { response } = require('express');
const bcrypt = require('bcryptjs')
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const userDB = await User.findOne({ email });    

        //Verificar si el usuario existe
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Wrong email or password'
            })
        }
           
        //Verificar si el password es correcto
        const validPassword = bcrypt.compareSync(password, userDB.password);

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Wrong email or password'
            })
        }
        
        //Generar el TOKEN - JWT
        const token = await generateJWT(userDB.id);

        return res.json({
            ok: true,
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

module.exports = {
    login
}