const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { uploadImage } = require('../helpers/img-update');

const updateImg = async(req, res = response) => {

    const table = req.params.table;
    const id = req.params.id;

    //Validar que exista la tabla
    const tableTypes = ['users', 'hospitals', 'doctors'];
    if (!tableTypes.includes(table)) {
        return res.status(400).json({
            ok: false,
            msg: 'Table' + table + 'not found'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded'
        });
    }
    
    //Procesar la imagen
    const file = req.files.imagen; 
    
    const cuttedName = file.name.split('.');
    const extension = cuttedName[cuttedName.length - 1];

    //Extensiones permitidas
    const extensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensions.includes(extension)) {
        return res.status(400).json({
            ok: false,
            msg: 'Extension not allowed'
        });
    }

    //Nombre del archivo
    const fileName = `${uuidv4()}.${extension}`;

    //Path del archivo
    const path = `./uploads/${table}/${fileName}`;

    //Mover el archivo
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
              ok: false,
              msg: 'Error moving file',
            });
        }    
        
        //Actualizar la imagen en la base de datos
        uploadImage(table, id, fileName);
    
        return res.json({
            ok: true,
            msg: 'Image Updated',
            fileName
        });
    });    
}

const showImg = (req, res = response) => {
    const table = req.params.table;
    const imagen = req.params.imagen;

    const pathImg = path.join( __dirname, `../uploads/${ table }/${ imagen }` );

    // imagen por defecto
    if ( fs.existsSync( pathImg ) ) {
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-img.jpg` );
        res.sendFile( pathImg );
    }
}

module.exports = {
    updateImg,
    showImg
}
