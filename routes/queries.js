/*
    Ruta: /api/all/
s
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getQueries, getArrayQueries } = require('../controllers/queries');

const router = Router();

router.get('/:query', validateJWT, getQueries )
router.get('/array/:table/:query', validateJWT, getArrayQueries )



module.exports = router;