// Imports
require('dotenv').config()
const express = require('express');
const passport = require('passport');
const { v4:uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Sign Up Route
router.post('/signup', async (req, res) => {
    const {email, password} = req.body
  
    const generatedUserId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)
  
    try {
  
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

// Log in Route
router.post('/login', async (req, res) => {
  const {email, password} = req.body

  try {

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

// Get Individual User Route
router.get('/user', async (req, res) => {
  const userId = req.query.userId

  try {

      const query = {user_id: userId}
      const user = await users.findOne(query)
      res.send(user)

  } finally {
      await client.close()
  }
})

// Update a User Route
router.put('/user', async (req, res) => {
    const formData = req.body.formData

    try {

        const query = {user_id: formData.user_id}

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

        res.json(insertedUser)

    } finally {
        await client.close()
    }
})

// Get all Users by userIds Route
router.get('/users', async (req, res) => {
  const userIds = JSON.parse(req.query.userIds)

  try {

      const pipeline =
          [
              {
                  '$match': {
                      'user_id': {
                          '$in': userIds
                      }
                  }
              }
          ]

      const foundUsers = await users.aggregate(pipeline).toArray()

      res.json(foundUsers)

    } finally {
      await client.close()
  }
})

/***** Returns (w/ filter) all the gendered-users into the browser *****/
router.get('/gendered-users', async (req, res) => {
  const gender = req.query.gender

  try {
    const query = { gender_identity: gender }
    const foundUsers = await users.find(query).toArray()

    res.send(foundUsers)
  } finally {
      await client.close()
  }

});

// Update User with a match
router.put('/addmatch', async (req, res) => {
  const client = new MongoClient(MONGO_CONNECTION_STRING)
  const {userId, matchedUserId} = req.body

  try {

      const query = {user_id: userId}
      const updateDocument = {
          $push: {matches: {user_id: matchedUserId}}
      }
      const user = await users.updateOne(query, updateDocument)
      res.send(user)
      
    } finally {
      await client.close()
  }
})

// Exports
module.exports = router;