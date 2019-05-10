require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const { router } = require('./routes/usuario');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // Middlewares

// parse application/json
app.use(bodyParser.json());

app.use('/', router);

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000..');
});