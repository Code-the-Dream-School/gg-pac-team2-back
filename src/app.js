require('dotenv').config();
require('express-async-errors');

const notFound = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/errorHandler');

const express = require('express');
const app = express();
const cors = require('cors');
const favicon = require('express-favicon');
const logger = require('morgan');

const mainRouter = require('./routes/mainRouter.js');
const authRouter = require('./routes/authRouter.js');
const profileRouter = require('./routes/profileRouter');
const requestRouter = require('./routes/requestRouter');


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// routes
app.use('/api/v1', mainRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/requests', requestRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

module.exports = app;
