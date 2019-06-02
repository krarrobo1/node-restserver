const express = require('express');
const fs = require('fs');
const path = require('path'); // obtiene el directorio actual

const { verificarTokenImg } = require('../middlewares/auth');

const imgs = express.Router();

imgs.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen) // envia el archivo a quien lo solicita
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }





});

function getImgUsuario() {

}




module.exports = {
    imgs
}