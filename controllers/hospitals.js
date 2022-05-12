const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitals = async(_req, res) => {

    const hospitals = await Hospital.find().populate('user', 'name img');

    return res.json({
        ok: true, 
        hospitals
    });
}

const createHospital = async(req, res = response) => {

    const uid  = req.uid;
    const hospital = new  Hospital({ user: uid, ...req.body });

    try {

        //Guardar hospital
         const hospitalDB = await hospital.save()
    
         return res.json({
            ok: true, 
            hospital: hospitalDB,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Talk to the administrator'
        });
    }   
}

const updateHospital = async(req, res = response) => {
    //TODO: Validar token y comprobar si el usuario es el mismo que esta actualizando

    const uid = req.params.id

    try {

        const hospitalDB = await Hospital.findById(uid);

        if(!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital not found'
            })
        }
        
        //Actualizar hospital
        const {password, google, email, ...campos} = req.body

        if (hospitalDB.email !== email) { 
            const validateEmail = await Hospital.findOne({ email });
            if(validateEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email already exists'
                })
            }
        }      
        
        campos.email = email
        
        const updatedHospital = await Hospital.findByIdAndUpdate(uid, campos, { new: true });


        return res.json({
            ok: true,
            updatedHospital
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Unexpected error...check logs'
        });
    }
}

const deleteHospital = async(req, res = response) => {

    const uid = req.params.id

    try {

        const hospitalDB = await Hospital.findById(uid);

        if(!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital not found'
            })
        }
        
       await Hospital.findByIdAndRemove(uid);

       return res.json({
            ok: true,
            msg: 'Hospital deleted successfully'
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
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
}
