require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // Middlewares

// parse application/json
app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
    res.json('get Usuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    if (body.nombre === undefined) res.status(400).json({
        ok: false,
        msj: 'El nombre es necesario'
    });
    else res.json({ persona: body });
});

app.put('/usuario', (req, res) => {
    res.json('put Usuario');
});

app.delete('/usuario/:id', (req, res) => { // mandado params mendiante url
    let id = req.params.id; // obteniendo params del url
    res.json({
        id
    });
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000..');
});