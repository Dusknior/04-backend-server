const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid,
        }
    
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        }, (err, token) => { 
            if(err) {
                console.log(err);
                reject(err);
            } else {
                resolve(token);
            }
        });

    })
    
}

module.exports = {
    generateJWT
}

