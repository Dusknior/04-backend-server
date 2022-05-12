const fs = require('fs');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

const replaceImg = ( path ) => {
    if ( fs.existsSync( path ) ) {
        // borrar la imagen anterior
        fs.unlinkSync( path );
    }
}

const uploadImage = async(table, id, fileName) => {

    let oldPath = '';

    switch (table) {
        case 'users':
            const user = await User.findById(id)
            if (!user) {
                return false
            }
            oldPath = `./uploads/users/${user.img}`;

            replaceImg(oldPath);

            user.img = fileName;
            await user.save();
            return true

        break;
        case 'hospitals':
            const hospital = await Hospital.findById(id)
            if (!hospital) {
                return false
            }
            oldPath = `./uploads/hospitals/${hospital.img}`;

            replaceImg(oldPath);

            hospital.img = fileName;
            await hospital.save();
            return true

        break;
        case 'doctors':
            const doctor = await Doctor.findById(id)
            if (!doctor) {
                return false
            }
            oldPath = `./uploads/doctors/${doctor.img}`;

            replaceImg(oldPath);

            doctor.img = fileName;
            await doctor.save();
            return true

        break;    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'Table not found'
            });            
    }


}


module.exports = {
    uploadImage
}