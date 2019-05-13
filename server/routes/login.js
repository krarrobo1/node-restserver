const express = require('express');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const Usuario = require('../models/usuario'); // Esquema de BD
const loginRoute = express.Router();


loginRoute.post('/login', (req, res) => {
    let body = req.body;
    // Busca al usuario usando su email
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        // Revisa si el correo es correcto
        if (!usuarioDB) return res.status(404).json({
            ok: false,
            err: {
                message: '*Usuario o password incorrectos'
            }
        });
        // Revisa si el password es correcto
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) return res.status(400).json({
            ok: false,
            err: {
                message: '*Usuario o *password incorrectos'
            }
        });
        // Si pasa la autenticacion crea un token
        let token = JWT.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        // Devuelve un json con la info del usuario + token
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});









module.exports = {
    loginRoute
};