const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {
    //Leer Token
    const token = req.header('x-token');

    //Revisar si no hay token
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No token avaliable'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        
        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Error validating token'
        });
    }          

}

module.exports = {
    validateJWT
}