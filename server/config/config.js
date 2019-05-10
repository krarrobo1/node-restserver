// Puerto
process.env.PORT = process.env.PORT || 3000;

// ================
// Entorno
// ================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================
// Base de datos
// ================

let urlDB;
//let pass = encodeURI('eldev_98');

if (process.env.NODE_ENV === 'dev') urlDB = 'mongodb://localhost:27017/cafe';
else urlDB = process.env.MONGO_URI;
//`mongodb+srv://ricardo_arr:${pass}@cafe-zqczv.mongodb.net/test?retryWrites=true`;

process.env.URLDB = urlDB;