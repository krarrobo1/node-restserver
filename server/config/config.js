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

process.env.CADUCIDAD_TOKEN = '48h';



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

// ================
// Google Client ID
// ================
//process.env.CLIENT_ID = process.env.CLIENT_ID || '810738198022-j2tpvkbgnf04q7amcfuuct49c0v0djmf.apps.googleusercontent.com';
process.env.CLIENT_ID = process.env.CLIENT_ID || '810738198022-qv2c3kc1ik7shpvef0rcullumdld9rt4.apps.googleusercontent.com';