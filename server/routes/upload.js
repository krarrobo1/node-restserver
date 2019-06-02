const express = require('express');
const fileUpload = require('express-fileupload');
const file = express.Router();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
file.use(fileUpload());

file.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha subido ningun archivo'
            }
        });
    }
    // Valida tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (!tiposValidos.some(tipov => tipov == tipo)) {
        return res.status(500).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son: ${tiposValidos.join(',')}`
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');

    let extension = nombreCortado[nombreCortado.length - 1];

    let extValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extValidas.some(extv => extv == extension)) {
        return res.status(500).json({
            ok: false,
            err: {
                message: `Los tipos de archivos permitidos son: ${extValidas.join(',')}`
            }
        });
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
        if (err) return res.status(500).json({ ok: false, err });
        switch (`${tipo}`) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // Si ocurre algun error se debe eliminar la imagen subida.
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe...'
                }
            });
        }
        // Si la imagen del usuario ya existe debe ser sobreescrita.
        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save();
        res.json({
            usuario: usuarioDB,
            img: nombreArchivo
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        productoDB.save();
        res.json({
            ok: true,
            producto: productoDB
        });
    })
}

function borrarArchivo(nombreImg, tipo) {
    let rutaImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
    console.log(rutaImg);
    if (fs.existsSync(rutaImg)) {
        console.log('true');
        fs.unlinkSync(rutaImg);
    };
}
module.exports = {
    file
}