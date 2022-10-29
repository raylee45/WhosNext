// Imports
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
require('./config/passport')(passport);
const {MongoClient} = require('mongodb')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// App Set up
const app = express();
const uri = process.env.URI
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

// API Routes
app.get('/', (req, res) => {
  res.json({ name: 'MERN Auth API', greeting: 'Welcome to the our API', author: 'YOU', message: "Smile, you are being watched by the Backend Engineering Team" });
});

// Sign up to the Database
app.post('/signup', async (req, res) => {
  const client = new MongoClient(uri)
  const {email, password} = req.body

  const generatedUserId = uuidv4()
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
      await client.connect()
      const database = client.db('app-data')
      const users = database.collection('users')

      const existingUser = await users.findOne({email})

      if (existingUser) {
          return res.status(409).send('User already exists. Please login')
      }

      const sanitizedEmail = email.toLowerCase()

      const data = {
          user_id: generatedUserId,
          email: sanitizedEmail,
          hashed_password: hashedPassword
      }

      const insertedUser = await users.insertOne(data)

      const token = jwt.sign(insertedUser, sanitizedEmail, {
          expiresIn: 60 * 24
      })
      res.status(201).json({token, userId: generatedUserId})

  } catch (err) {
      console.log(err)
  } finally {
      await client.close()
  }
})

// Log in to the Database
app.post('/login', async (req, res) => {
  const client = new MongoClient(uri)
  const {email, password} = req.body

  try {
      await client.connect()
      const database = client.db('app-data')
      const users = database.collection('users')

      const user = await users.findOne({email})

      const correctPassword = await bcrypt.compare(password, user.hashed_password)

      if (user && correctPassword) {
          const token = jwt.sign(user, email, {
              expiresIn: 60 * 24
          })
          res.status(201).json({token, userId: user.user_id})
      }

      res.status(400).json('Invalid Credentials')

  } catch (err) {
      console.log(err)
  } finally {
      await client.close()
  }
})

// Server
const server = app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));

module.exports = server;
