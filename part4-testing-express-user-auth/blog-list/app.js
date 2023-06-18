const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => console.log('connected mongodb'));

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

module.exports = app