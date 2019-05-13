const JWT = require('jsonwebtoken');

// ========================
// Verificar Token
// ========================

// Funcion middleware
let verificarToken = (req, res, next) => {

    let token = req.get('Authorization'); // Obtiene el token desde los headers
    // verifica el token con la funcion (token, seed, callback)
    JWT.verify(token, process.env.SEED, (err, decoded) => {
        if (err) return res.status(401).json({
            ok: false,
            err: {
                message: 'Token no valido'
            }
        });
        // Si coincide escribe una propieda usuario en el request
        req.usuario = decoded.usuario; // decoded (payload del token)
        // Continua con el flujo de ejecucion
        next();
    });
};

// ========================
// Verificar AdminRole
// ========================

let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role !== 'ADMIN_ROLE') return res.status(400).json({
        ok: false,
        err: {
            message: 'El usuario no es administrador.'
        }
    });
    console.log('Correcto!');
    next();
};

module.exports = {
    verificarToken,
    verificarAdminRole
}