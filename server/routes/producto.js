const express = require('express');
let { verificarToken } = require('../middlewares/auth');
const productoRoute = express.Router();

let Producto = require('../models/producto');

let Categoria = require('../models/categoria');


// Obtener todos los productos
productoRoute.get('/productos', (req, res) => {
    // paginado
    let inicio = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    // Trae todos los productos
    Producto.find({ disponible: true })
        // populate: usuario categoria
        .skip(inicio)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
            if (err) return res.status(400).json({
                ok: false,
                err
            });
            res.json({
                ok: true,
                productosDB
            })
        });

});

// Obtener un producto por ID
productoRoute.get('/productos/:id', (req, res) => {
    let id = req.params.id;
    // populate: usuario categoria
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) return res.status(400).json({
                ok: false,
                err
            });
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// Crear un nuevo producto

productoRoute.post('/productos', verificarToken, (req, res) => {
    let body = req.body;
    let idUsuario = req.usuario._id;
    let categoria = body.categoria;
    Categoria.findOne({ nombre: categoria }, async(err, categoriaDB) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        });
        if (!categoriaDB) return res.status(400).json({
            ok: false,
            err: {
                message: `No existe una Categoria: ${categoria} `
            }
        });
        let idCategoria = await categoriaDB._id;

        let nuevoProducto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible,
            categoria: idCategoria,
            usuario: idUsuario
        });
        nuevoProducto.save((err, producto) => {
            if (err) return res.status(400).json({
                ok: false,
                err
            });
            res.json({
                ok: true,
                producto
            });
        });

    });

    // grabar el usuario
    // grabar una categoria del listado
});


// Actualizar un nuevo producto

productoRoute.put('/productos/:id', (req, res) => {
    // grabar el usuario
    let id = req.params.id;
    let body = req.body;
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        });
        if (!productoDB) return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha encontrado producto con dicho ID'
            }
        });
        res.json({
            ok: true,
            producto: productoDB
        });
    });
    // grabar una categoria del listado
});

productoRoute.delete('/productos/:id', (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        });
        if (!productoDB) return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha encontrado producto con dicho ID'
            }
        });
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//Buscar producto
productoRoute.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;

    let regexp = new RegExp(termino, 'i');
    Producto.find({ nombre: regexp })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) return res.status(400).json({
                ok: false,
                err
            });
            res.json({
                ok: true,
                productos
            });
        });
});
module.exports = {
    productoRoute
}