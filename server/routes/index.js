const express = require('express');
const app = express();

const { router } = require('./usuario');
const { loginRoute } = require('./login');
const { categoriaRoute } = require('./categoria');

app.use('/', router);
app.use('/', loginRoute);
app.use('/', categoriaRoute);


module.exports = app;