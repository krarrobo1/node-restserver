const express = require('express');
let { verificarToken } = require('../middlewares/auth');
const productoRoute = express.Router();

let Producto = require('../models/producto');

let Categoria = require('../models/categoria');


// Obtener todos los productos
productoRoute.get('/productos', (req, res) => {
    // Trae todos los productos
    Producto.find({})
        .exec((err, productosDB) => {

        });
    // populate: usuario categoria
    // paginado

});

// Obtener un producto por ID
productoRoute.get('/productos/:id', (req, res) => {
    // populate: usuario categoria
    // paginado
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

async() => {

}
// Actualizar un nuevo producto

productoRoute.put('/productos/:id', (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
});

productoRoute.delete('/productos/:id', (req, res) => {
    // cambiar atributo disponible a false.
});





















module.exports = {
    productoRoute
}