const { response } = require('express');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

const getQueries = async(req, res = response) => {

    const query = req.params.query;
    const regex = new RegExp(query, 'i');

    const [users, hospitals, doctors] = await Promise.all([
        User.find({ name: regex }, 'role google name email uid '),
        Hospital.find({ name: regex }).populate('user', 'name img'),
        Doctor.find({ name: regex }, 'name img').populate('user', 'name img').populate('hospital', 'name img'),
    ]);
    
    return res.json({
        ok: true,
        users,
        hospitals,
        doctors
    });
}

const getArrayQueries = async(req, res = response) => {

    const table = req.params.table;
    const query = req.params.query;
    const regex = new RegExp(query, 'i');

    let data = [];

    switch (table) {
        case 'users':
            data = await User.find({ name: regex }, 'role google name email uid ')
        break;
        case 'hospitals':
            data = await Hospital.find({ name: regex }).populate('user', 'name img')
        break;
        case 'doctors':
            data = await Doctor.find({ name: regex }, 'name img').populate('user', 'name img').populate('hospital', 'name img')
        break;    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'Table not found'
            });            
    }

    return res.json({
        ok: true,
        entries: data
    });
}

module.exports = {
    getQueries,
    getArrayQueries
}
