// Imports
require('dotenv').config()
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router()

// Get Messages by from_userId and to_userId Route
router.get('/messages', async (req, res) => {
  const { userId, correspondingUserId } = req.query

  try {
  
    const query = {
      from_userId: userId, to_userId: correspondingUserId
    }
    const foundMessages = await messages.find(query).toArray()
    res.send(foundMessages)
  } finally {
      await client.close()
  }
})

// Add a Message Route
router.post('/message', async (req, res) => {
  const client = new MongoClient(MONGO_CONNECTION_STRING)
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

// Exports
module.exports = router;