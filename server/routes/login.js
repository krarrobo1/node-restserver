const express = require('express');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciones de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}



loginRoute.post('/google', async(req, res) => {
    let token = req.body.idtoken; // Obteniendo el token de la peticion Ajax
    //console.log(token);
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (usuarioDB) { // si el usuario existe en la BD
            if (usuarioDB.google === false) { // Si no se registro con google debe usar su atenticacion normal
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal'
                    }
                });
            } else { // Si se registro con google se renueva su token
                let token = JWT.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({ // retornamos sus datos y token en la response
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // Si el usuario no existe en nuestra BD creamos uno nuevo con sus datos de google
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            // Lo guardamos en la DB con el metodo save()
            usuario.save((err, usuarioDB) => {
                if (err) return res.status(500).json({
                    ok: false,
                    err
                });
                // Creamos su token
                let token = JWT.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                // Devolvemos sus datos en el response.
                console.log(token);
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
});

module.exports = {
    loginRoute
};