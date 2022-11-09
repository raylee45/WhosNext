// Imports
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { v4:uuidv4 } = require('uuid');

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
require('./config/passport')(passport);

// App Set up
const app = express();
app.use(cors());
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // JSON parsing
app.use(cors()); // allow all CORS requests
app.use(passport.initialize());

// Database Set Up
mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to MongoDB at HOST: ${db.host} and PORT: ${db.port}`);
});

db.on('error', (error) => {
    console.log(`Database Error: ${error}`);
})

// API Routes
app.get('/', (req, res) => {
  res.json('Hello to my app');
});

app.use('/message', require('./controllers/message'));
app.use('/users', require('./controllers/user'));
app.use('/matches', require('./controllers/matches'));


// Server
const server = app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));

module.exports = server;