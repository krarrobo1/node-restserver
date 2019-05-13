const express = require('express');
const app = express();

const { router } = require('./usuario');
const { loginRoute } = require('./login');

app.use('/', router);
app.use('/', loginRoute);


module.exports = app;