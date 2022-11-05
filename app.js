// Imports
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { v4:uuidv4 } = require('uuid');
// const jwt = require('jsonwebtoken');

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
  const client = new MongoClient(MONGO_CONNECTION_STRING)
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
  const client = new MongoClient(MONGO_CONNECTION_STRING)
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
  const client = new MongoClient(MONGO_CONNECTION_STRING)
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

// /***** we are passing thru a message from the req.body.message.. *****
//  *****  while collecting our message collections *****/
// app.post('/message', async (req, res) => {
//   const client = new MongoClient(MONGO_CONNECTION_STRING)
//   const messsage = req.body.message

//   try {
//     await client.connect()
//     const database = client.db('whosNext')
//     const messages = database.collection('messages')
//     const insertedMessage = await messages.insertOne(message)
//     res.send(insertedMessage)
//   } finally {
//       await client.close()
//   }
// })









//////////////////



/***** after API ROUTES app.get route
 * passing data from front-end to back-end *****/
//  app.get('/signup', async (req, res) => {
//   const client = new MongoClient(MONGO_CONNECTION_STRING)
//   const { email, password } = req.body

//   const generatedUserId = uuidv4()
//   const hashedPassword = await bcrypt.hash(password, 10)

//   try {
//     client.connect()
//     const database = client.db('whosNext')
//     const users = database.collection('users')

//     const existingUser = users.findOne({ email })

//     if (existingUser) {
//       return res.status(409).send('User already exists. Please login')
//     } 

//     const sanitizedEmail = email.toLowerCase()

//     const data = {
//       user_id: generatedUserId,
//       email: sanitizedEmail,
//       hashed_password: hashedPassword
//     }
//     const insertedUser = await users.insertOne(data)

//     const token = jwt.sign(insertedUser, sanitizedEmail, {
//       expiresIn: 60 * 24,
//     })

//     res.status(201).json({ token, userId: generatedUserId })
//   } catch(err) {
//     console.log(err)
//   }
// });

/***** log in *****/
// app.post('/login', async (req, res) => {
// const client = new MongoClient(MONGO_CONNECTION_STRING)
// const { email, password } = req.body

// try {
//   await client.connect()
//   const database = client.db('whosNext')
//   const users = database.collection('users')

//   const user = await users.findOne({ email })

//   const correctPassword = await bcrypt.compare(password, user.hashed_password)

//   if (user && correctPassword) {
//   const token = jwt.sign(user, email, {
//       expiresIn: 60 * 24
//   })
//   res.status(201).json({ token, userId: user.user_id })
//   }
//   res.status(400).send('Invalid Credentials')
// } catch(err) {
//   console.log(err)
// }
// })

/***** User *****/
// app.get('/users', async (req, res) => {
// const client = new MongoClient(MONGO_CONNECTION_STRING)
// const userId = req.query.userId

// try {
//   await client.connect()
//   const database = client.db('whosNext')
//   const users = database.collection('users')

//   const query = { user_id: userId }
//   const user = await users.findOne(query)
//   res.send(user)
// } finally {
//   await client.close()
// }
// })

// /***** going into our DB and find many documents based on the matches/userIds *****/
// /** define pipleline: 
// *    - will use an array to look in our db for multiple documents of the user by their userIds */
// app.get('/users', async (req, res) => {
// const client = new MongoClient(MONGO_CONNECTION_STRING)
// const userIds = JSON.parse(req.query.userIds)
// // console.log(userIds)

// try {
//   await client.connect()
//   const database = client.db('whosNext')
//   const users = database.collection('users')

//   const pipeline =
//   [
//       {
//       '$match': {
//           'user_id': {
//           '$in': userIds
//           }
//       }
//       }
//   ]
//   const foundUsers = users.aggregate(pipeline).toArray()  
//   console.log(foundUsers)
//   res.send(foundUsers)

// } finally {
//   await client.close()
// }
// })

/***** Looking for user that is logged in *****/
/** once found -> will update the 'matches array' by pushing in the matchedUserId */
app.put('/addmatch', async(req, res) => {
  const client = new MongoClient(MONGO_CONNECTION_STRING)
  const { userId, matchedUserId } = req.body

  try {
    await client.connect()
    const database = client.db('whosNext')
    const users = database.collection('users')

    const query = { user_id: userId }
    const updateDocument = {
      $push: { matches: { user_id: matchedUserId }},
    }
    const user = await users.updateOne(query, updateDocument)
    res.send(user)
  } finally {
      await client.close()
  }
})











app.use('/message', require('./controllers/message'));
app.use('/users', require('./controllers/user'));
app.use('/match', require('./controllers/matches'));


// Server
const server = app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));

module.exports = server;