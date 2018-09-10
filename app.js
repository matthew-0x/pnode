const express = require('express');
const app = express();
const logger = require('morgan');
const mongoose = require('mongoose');
const productRoutes = require ('./api/routes/products');
const orderRoutes = require ('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const dbPassword = process.env.dbpw;

mongoose.connect(`mongodb+srv://admin:${dbPassword}@retail-qvx4w.mongodb.net/shop`);

app.use(logger('dev'));
app.use(express.json());
app.options('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
  });
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);


app.use((req, res, next) => {
    const error = new Error('bad request');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ 
        error: { message: error.message  }
    });
});

module.exports = app;