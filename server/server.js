require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const routes = require('./routes/index');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // Middlewares

// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public para que pueda ser accedida
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(routes);


mongoose.connect(process.env.URLDB, { useNewUrlParser: true })
    .then(
        () => { console.log('MongoDB Ready to use') },
        err => console.log('Error:', JSON.stringify(err, null, 2))
    );

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000..');
});