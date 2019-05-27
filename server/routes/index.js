const express = require('express');
const app = express();

const { router } = require('./usuario');
const { loginRoute } = require('./login');
const { categoriaRoute } = require('./categoria');
const { productoRoute } = require('./producto');
const { file } = require('./upload');
app.use('/', router);
app.use('/', loginRoute);
app.use('/', categoriaRoute);
app.use('/', productoRoute);
app.use('/', file);

module.exports = app;