const express = require('express');
const morgan = require('morgan')
const app = express();
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const mongoose = require('mongoose');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => console.log('connected mongodb'));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))


app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.errorHandler);

module.exports = app;
