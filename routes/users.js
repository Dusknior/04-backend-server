/*
    Ruta: /api/users

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');

const router = Router();

router.get('/', validateJWT, getUsers )

router.post('/',[
    check('name', 'Name is an obligatory field').not().isEmpty(),
    check('password', 'Password is obligatory').not().isEmpty(),   
    check('email', 'Email is obligatory').isEmail(),
    validateFields
] ,createUser )

router.put('/:id',[
    validateJWT,
    check('name', 'Name is an obligatory field').not().isEmpty(),
    check('email', 'Email is obligatory').isEmail(),
    check('role', 'Role is an obligatory field').not().isEmpty(),
    validateFields
] ,updateUser )

router.delete('/:id', validateJWT, deleteUser )



module.exports = router;