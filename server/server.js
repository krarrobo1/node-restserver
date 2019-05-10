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

mongoose.connect(process.env.URLDB, { useNewUrlParser: true })
    .then(
        () => { console.log('Ready to use') },
        err => console.log(err)
    );

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000..');
});