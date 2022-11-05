require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;
const mongoose = require('mongoose');

// DB Models
const Messages = require('../models/message');
const User = require('../models/user')

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Purpose: Fetch one example from DB and return
    console.log('=====> Inside GET /message');

// where operator for mongoose to display both users chat
    Messages.find({from_userId: req.user._id})
    .then((messages) => {
        res.json({ messages: messages });
    })
    .catch(err => {
        console.log('Error in message from_userId:', err);
        res.json({ messages: '***** ERROR *****.'})
    });
});


router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Purpose: Create one example by adding body to DB, and return
    console.log('=====> Inside POST /message');
    console.log('=====> req.body', req.body); // object used for creating new example
    const message = {
      to_userId: req.user,
      message: req.body.message,
      timestamp: new Date().toISOString(),
    }

    const insertedMessage = await Messages.create(message)
    res.send(insertedMessage)
});

module.exports = router;