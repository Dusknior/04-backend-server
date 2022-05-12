const { response } = require('express');
const Doctor = require('../models/doctor');

const getDoctors = async(_req, res) => {

    const doctors = await Doctor.find().populate('user', 'name img').populate('hospital', 'name img');

    return res.json({
        ok: true, 
        doctors
    });
}

const createDoctor = async(req, res = response) => {

    const uid  = req.uid;
    const doctor = new  Doctor({ user: uid, ...req.body });

    try {

        //Guardar doctor
         const doctorDB = await doctor.save()
    
         return res.json({
            ok: true, 
            doctor: doctorDB,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Talk to the administrator'
        });
    }   
}

const updateDoctor = async(req, res = response) => {
    //TODO: Validar token y comprobar si el usuario es el mismo que esta actualizando

    const uid = req.params.id

    try {

        const doctorDB = await Doctor.findById(uid);

        if(!doctorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Doctor not found'
            })
        }
        
        //Actualizar doctor
        const {password, google, email, ...campos} = req.body

        if (doctorDB.email !== email) { 
            const validateEmail = await Doctor.findOne({ email });
            if(validateEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email already exists'
                })
            }
        }      
        
        campos.email = email
        
        const updatedDoctor = await Doctor.findByIdAndUpdate(uid, campos, { new: true });


        return res.json({
            ok: true,
            updatedDoctor
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Unexpected error...check logs'
        });
    }
}

const deleteDoctor = async(req, res = response) => {

    const uid = req.params.id

    try {

        const doctorDB = await Doctor.findById(uid);

        if(!doctorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Doctor not found'
            })
        }
        
       await Doctor.findByIdAndRemove(uid);

       return res.json({
            ok: true,
            msg: 'Doctor deleted successfully'
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
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
}
