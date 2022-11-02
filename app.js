// Imports
require('dotenv').config()
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { v4:uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const bcrypt = require('bcrypt')

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
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to MongoDB at HOST: ${db.host} and PORT: ${db.port}`);
});

db.on('error', (error) => {
    console.log(`Database Error: ${error}`);
})

// Home Routes
app.get('/', (req, res) => {
  res.json({ name: 'MERN Auth API', greeting: 'Welcome to the our API', author: 'YOU', message: "Smile, you are being watched by the Backend Engineering Team" })
});

app.use('/message', require('./controllers/message'));
app.use('/user', require('./controllers/user'));

// Server
const server = app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));

module.exports = server;