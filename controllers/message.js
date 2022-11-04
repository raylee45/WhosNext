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

const index = async (req, res) => {
  const allMessages = await db.Message.find();
  if (allMessages.length >= 1) res.json({ messages: allMessages });
  else res.json({ messages: 'There are no messages' });
}

const show = async (req, res) => {
  const showMessage = await db.Message.findOne({ _id: req.params.id });
  res.json({ message: showMessage });
}




// router.get('/message', async (req, res) => {
//     const client = new MongoClient(MONGO_CONNECTION_STRING)
//     const { userId, correspondingUserId } = req.query
//     // console.log(userId, correspondingUserId)
//     try {
//       await client.connect()
//       const database = client.db('whosNext')
//       const messages = database.collection('messages')
    
//       const query = {
//         from_userId: userId, to_userId: correspondingUserId
//       }
//       const foundMessages = await messages.find(query).toArray()
//       res.send(foundMessages)
//     } finally {
//         await client.close()
//     }
//   })

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
      from_userId: req.user,
      message: req.body.message,
      timestamp: new Date().toISOString(),
      // to_userId: String,
    }

    const insertedMessage = await Messages.create(message)
    res.send(insertedMessage)


    // Message.create(req.body)
    // .then(insertedMessage => {
    //     console.log('New message created', insertedMessage);
    //     res.send(insertedMessage);
    // })
    // .catch(err => {
    //     console.log('Error in example#create:', err);
    //     res.json({ message: 'Error occured... Please try again.'});
    // })
});

/***** we are passing thru a message from the req.body.message.. *****
 *****  while collecting our message collections *****/
// router.post('/message', async (req, res) => {
//     const client = new MongoClient(MONGO_CONNECTION_STRING)
//     const messsage = req.body.message
  
//     try {
//       await client.connect()
//       const database = client.db('whosNext')
//       const messages = database.collection('messages')
//       const insertedMessage = await messages.insertOne(message)
//       res.send(insertedMessage)
//     } finally {
//         await client.close()
//     }
//   })



router.put('/:to_userId', (req, res) => {
    // Purpose: Update one example in the DB, and return
    console.log('=====> Inside PUT /message/:to_userId');
    console.log('=====> req.params', req.params); // object used for finding example by id
    console.log('=====> req.body', req.body); // object used for updating example

    Messages.findByIdAndUpdate(req.params.to_userId, req.body, { new: true })
    .then(editedMessage => {
        console.log('Message edited', editedMessage);
        res.redirect(`/messages/${req.params.to_userId}`);
    })
    .catch(err => {
        console.log('***** Error in editting message *****:', err);
        res.json({ message: '***** ERROR *****'});
    });
});

router.delete('/:to_userId', (req, res) => {
    // Purpose: Update one example in the DB, and return
    console.log('=====> Inside DELETE /message/:to_userId');
    console.log('=====> req.params');
    console.log(req.params); // object used for finding message by id
    
    Messages.findByIdAndRemove(req.params.to_userId)
    .then(response => {
        console.log(`Message ${req.params.to_userId} was deleted`, response);
        res.redirect(`/message/${req.params.to_userId}`);
    })
    .catch(err => {
        console.log('***** Error in deleting message *****:', err);
        res.json({ message: '***** ERROR *****'});
    });
});

module.exports = router;