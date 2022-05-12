/*
    Ruta: /api/doctors

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getDoctors, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctors.js');

const router = Router();

router.get('/', validateJWT, getDoctors )

router.post('/',[
    validateJWT,
    check('name', 'Name of the doctor is required').not().isEmpty(),
    check('hospital', 'Hospital is not valid').isMongoId(),
    validateFields
] ,createDoctor )

router.put('/:id',[
] ,updateDoctor )

router.delete('/:id', deleteDoctor )



module.exports = router;