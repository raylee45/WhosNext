// Imports
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { v4:uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors')

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







/***** Returns (w/ filter) all the gendered-users into the browser *****/
app.get('/gendered-users', async (req, res) => {
  const client = new MongoClient(uri)
  const gender = req.query.gender

  try {
    await client.connect()
    const database = client.db('whosNext')
    const users = database.collection('users')
    const query = { gender_identity: gender }
    const foundUsers = await users.find(query).toArray()

    res.send(foundUsers)
  } finally {
      await client.close()
  }

});

/***** Update User *****/
app.put('/user', async (req, res) => {
  const client = new MongoClient(uri)
  const formData = req.body.formData

  try {
    await client.connect()
      const database = client.db('whos Next')
      const users = database.collection('users')

      const query = { user_id: formData.user_id }
      const updateDocument = {
        $set: {
          first_name: formData.first_name,
          dob_day: formData.dob_day,
          dob_month: formData.dob_month,
          dob_year: formData.dob_year,
          show_gender: formData.show_gender,
          gender_identity: formData.gender_identity,
          gender_interest: formData.gender_interest,
          url: formData.url,
          about: formData.about,
          matches: formData.matches 
        },
      }
      const insertedUser = await users.updateOne(query, updateDocument)
      res.send(insertedUser)
  } finally {
      await client.close()
  }
})



app.get('/messages', async (req, res) => {
  const client = new MongoClient(uri)
  const { userId, correspondingUserId } = req.query
  // console.log(userId, correspondingUserId)
  try {
    await client.connect()
    const database = client.db('whosNext')
    const messages = database.collection('messages')
  
    const query = {
      from_userId: userId, to_userId: correspondingUserId
    }
    const foundMessages = await messages.find(query).toArray()
    res.send(foundMessages)
  } finally {
      await client.close()
  }
})

/***** we are passing thru a message from the req.body.message.. *****
 *****  while collecting our message collections *****/
app.post('/message', async (req, res) => {
  const client = new MongoClient(uri)
  const messsage = req.body.message

  try {
    await client.connect()
    const database = client.db('whosNext')
    const messages = database.collection('messages')
    const insertedMessage = await messages.insertOne(message)
    res.send(insertedMessage)
  } finally {
      await client.close()
  }
})



app.use('/examples', require('./controllers/example'));
app.use('/users', require('./controllers/user'));

// Server
const server = app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));

module.exports = server;