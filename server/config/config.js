// Puerto
process.env.PORT = process.env.PORT || 3000;

// ================
// Entorno
// ================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ================
// Vencimiento del Token
// ================

// 60 segundos, 60 min, 24 horas, 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



// ================
// SEED de autenticacion (key)
// ================

process.env.SEED = process.env.SEED || 'secret-seed-de-desarrollo';

// ================
// Base de datos
// ================

let urlDB;

if (process.env.NODE_ENV === 'dev') urlDB = 'mongodb://localhost:27017/cafe';
else urlDB = process.env.MONGO_URI;


process.env.URLDB = urlDB;