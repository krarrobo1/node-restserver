const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario'); // Esquema de BD
const { verificarToken, verificarAdminRole } = require('../middlewares/auth');
const router = express.Router();
// Obtiene usuarios, (requiere de un token en los Headers)

// verificarToken es un middleware de Autenticacion
router.get('/usuario', verificarToken, (req, res) => {

    let estado = req.query.estado || true;
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    Usuario.find({ estado: estado }, 'nombre email role estado google img') // Devuelve un obj Query, el primer parametro es la condicion para buscar y el segundo es la proyeccion.
        .skip(Number(desde))
        .limit(Number(limite))
        .exec((err, usuarios) => {
            if (err) return res.status(400).json({
                ok: false,
                err
            });

            Usuario.count({ estado: estado }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })

        })

});

//Crea un usuario nuevo
router.post('/usuario', [verificarToken, verificarAdminRole], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });
    usuario.save((err, usuarioDB) => {
        if (err) return res.status(400).json({
            ok: false,
            err: err
        });
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});
// Cambia la info del usuario
router.put('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id; // obteniendo params del url
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    // pick filtra el objeto y retorna solamente los valores de las keys especificadas.

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        });
        res.json({
            ok: true,
            status: 200,
            usuario: usuarioDB
        });
    });
});

router.delete('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => { // mandado params mendiante url
    let id = req.params.id;
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, updated) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        });
        if (!updated) return res.status(404).json({
            ok: false,
            err: {
                message: 'No se ha encontrado un usuario con ese ID'
            }
        })
        res.json({
            ok: true,
            usuario: updated
        })
    });
    /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        });
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });*/
});

module.exports = {
    router
}