/*
    Ruta: /api/uploads/
s
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validateJWT } = require('../middlewares/validate-jwt');
const {  updateImg, showImg } = require('../controllers/uploads');

const router = Router();

router.use(expressFileUpload());

router.put('/:table/:id', validateJWT, updateImg )
router.get('/:tipo/:imagen', showImg );



module.exports = router;