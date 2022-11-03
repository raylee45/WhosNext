require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

router.get('/messages', async (req, res) => {
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

// router.get('/:id', (req, res) => {
//     // Purpose: Fetch one example from DB and return
//     console.log('=====> Inside GET /examples/:id');

//     Example.findById(req.params.id)
//     .then(example => {
//         res.json({ example: example });
//     })
//     .catch(err => {
//         console.log('Error in example#show:', err);
//         res.json({ message: 'Error occured... Please try again.'})
//     });
// });


// router.post('/', (req, res) => {
//     // Purpose: Create one example by adding body to DB, and return
//     console.log('=====> Inside POST /examples');
//     console.log('=====> req.body', req.body); // object used for creating new example

//     Example.create(req.body)
//     .then(newExample => {
//         console.log('New example created', newExample);
//         res.redirect(`/examples/${newExample.id}`);
//     })
//     .catch(err => {
//         console.log('Error in example#create:', err);
//         res.json({ message: 'Error occured... Please try again.'});
//     })
// });

/***** we are passing thru a message from the req.body.message.. *****
 *****  while collecting our message collections *****/
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



router.put('/:id', (req, res) => {
    // Purpose: Update one example in the DB, and return
    console.log('=====> Inside PUT /examples/:id');
    console.log('=====> req.params', req.params); // object used for finding example by id
    console.log('=====> req.body', req.body); // object used for updating example

    Example.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedExample => {
        console.log('Example updated', updatedExample);
        res.redirect(`/examples/${req.params.id}`);
    })
    .catch(err => {
        console.log('Error in example#update:', err);
        res.json({ message: 'Error occured... Please try again.'});
    });
});

router.delete('/:id', (req, res) => {
    // Purpose: Update one example in the DB, and return
    console.log('=====> Inside DELETE /examples/:id');
    console.log('=====> req.params');
    console.log(req.params); // object used for finding example by id
    
    Example.findByIdAndRemove(req.params.id)
    .then(response => {
        console.log(`Example ${req.params.id} was deleted`, response);
        res.redirect(`/examples`);
    })
    .catch(err => {
        console.log('Error in example#delete:', err);
        res.json({ message: 'Error occured... Please try again.'});
    });
});

module.exports = router;