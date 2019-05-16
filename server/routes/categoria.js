const express = require('express');
const _ = require('underscore');
let { verificarToken, verificarAdminRole } = require('../middlewares/auth');

const categoriaRoute = express.Router();

let Categoria = require('../models/categoria');

// Obtener todas las categorias

categoriaRoute.get('/categoria', (req, res) => {
    Categoria.find({})
        .populate('usuario')
        .exec((err, categoriadb) => {
            if (err) return res.status(500).json({
                ok: false,
                err
            });
            res.json({
                ok: true,
                categoria: categoriadb
            })
        })

});

//  Mostrar una categoria por ID

categoriaRoute.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id).exec((err, categoria) => {
        if (err) return res.status(404).json({
            ok: false,
            err: {
                message: 'No se ha encontrado categoria con ese ID'
            }
        });
        res.status(200).json({
            categoria
        })
    });
});

// Crear una nueva categoria

categoriaRoute.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;
    let usuario = req.usuario._id;
    let nuevaCategoria = Categoria({
        nombre: body.nombre,
        estado: body.estado,
        usuario: usuario
    });
    nuevaCategoria.save((err, categoriaDB) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        });

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Actualizar una categoria

categoriaRoute.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    console.log(req.body.nombre);
    Categoria.findByIdAndUpdate(id, { nombre: req.body.nombre }, { new: true }, (err, categoria) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });

        res.json({
            ok: true,
            categoria
        });
    });
});

//  Borrar Categoria
categoriaRoute.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    // Solo un admin puede borrar categoria
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, removed) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!removed) return res.status(400).json({
            ok: false,
            err: {
                message: 'El id no existe'
            }
        });
        res.status(200).json({
            ok: true,
            removed
        });
    });
});
module.exports = { categoriaRoute };