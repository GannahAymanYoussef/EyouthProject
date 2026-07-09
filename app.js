const express = require('express');
const morgan = require('morgan');
const AppError = require('/utils/appError');
const globalErrorHandler = require('./middlewares/errorHandler')

const app = express();
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());

const categoryRouter = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');

app.use('./api/categories', categoryRouter);
app.use('./api/products', productRouter);
app.use('./api/cart', cartRouter);
app.use('./api/orders', orderRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404))
});

app.use(globalErrorHandler);

module.exports = app;