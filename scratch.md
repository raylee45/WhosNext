## Spotify

```js
Imports
const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('../models');
const passport = require('../config/ppConfig');
const axios = require('axios')
const querystring = require('querystring');
const { response } = require('express');
let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
let authKey = buff.toString('base64');// changes key to string
```

```js
router.get('/', (req, res)=>{
    axios.post('https://accounts.spotify.com/api/token', 
        querystring.stringify({
            grant_type: 'client_credentials',
        }),
        {
            headers: {
                Authorization: `Basic ${authKey}`
           } 
           
    }).then((response)=>{                    
        token = response.data.access_token
        const config ={
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        let composer = req.query.composer
        let track = req.query.track
        let query = encodeURIComponent(`${composer} ${track}`)
        axios.get(`https://api.spotify.com/v1/search?q=${query}&type=artist,track&offset=0&limit=20`, config)
        .then((response)=>{                    
            console.log(response.data)
            let tracks = response.data.tracks.items
            res.render('trackResults', {tracks})
          })
          .catch(err =>{
            console.log(err)
          })
       //use search query in here'
        console.log(token)
        
      })
    .catch(err=>{
        console.log("error", err.message)
    })
})
```

```js
router.get('/:id', (req, res)=>{
    // console.log(req.params)
    axios.post('https://accounts.spotify.com/api/token',
    querystring.stringify({
        grant_type: 'client_credentials',
    }),
    {
        headers: {
            Authorization: `Basic ${authKey}`
       } 
       
    }).then((response)=>{                    
        let token = response.data.access_token
        const config ={
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        console.log(req.params)
        if(req.params.id === '[object Object]'){
            console.log('this is wrong')
        }else{
            console.log(req.params.id)
        }
        let trackId = req.params.id
        // console.log('line 68', trackId)
        try{
            
            axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, config)
                .then((response)=> {
            console.log('line 71', response.data.album.images[0])
            let result = response.data
                console.log(result)
            db.comment.findAll({
                where: {apiTrackId: req.params.id}//line 74
            }).then((comments)=>{
                res.render('trackDetails', {comments, result})//render found comments db query and result
            })
            
           
            }).catch(err=>{
                // console.log('error', err)
            })
        }catch{
            console.log('this')
        }
    })
})
```

# Merge One Branch to Another

```text
git checkout feature1
git merge master
```

#### Resources

Making a *pull request* from a **fork** [link](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwi9-6rCkpLvAhV0GjQIHcjMA5kQFjAAegQIBRAD&url=https%3A%2F%2Fdocs.github.com%2Fen%2Fgithub%2Fcollaborating-with-issues-and-pull-requests%2Fsyncing-a-fork&usg=AOvVaw3UCyL7JejM3Yi47oGqkaaa)
TFS: Updating branch with changes from main [link](https://stackoverflow.com/questions/5317703/tfs-updating-branch-with-changes-from-main)
[How to add authorization header in POSTMAN environment?](https://stackoverflow.com/questions/40539609/how-to-add-authorization-header-in-postman-environment)
[JSON Web Token](https://github.com/auth0/node-jsonwebtoken)



mongodb+srv://Nadia:nadia123@cluster0.tdvtubw.mongodb.net/whosNext


database code for connection is okay?
having trouble w/ github 


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



// router.put('/', (req, res) => {
//     // Purpose: Update one example in the DB, and return
//     console.log('=====> Inside PUT /message/:to_userId');
//     console.log('=====> req.params', req.params); // object used for finding example by id
//     console.log('=====> req.body', req.body); // object used for updating example

//     Messages.findByIdAndUpdate(req.params.to_userId, req.body, { new: true })
//     .then(editedMessage => {
//         console.log('Message edited', editedMessage);
//         res.redirect(`/messages/${req.params.to_userId}`);
//     })
//     .catch(err => {
//         console.log('***** Error in editting message *****:', err);
//         res.json({ message: '***** ERROR *****'});
//     });
// });

// router.delete('/', (req, res) => {
//     // Purpose: Update one example in the DB, and return
//     console.log('=====> Inside DELETE /message/:to_userId');
//     console.log('=====> req.params');
//     console.log(req.params); // object used for finding message by id
    
//     Messages.findByIdAndRemove(req.params.to_userId)
//     .then(response => {
//         console.log(`Message ${req.params.to_userId} was deleted`, response);
//         res.redirect(`/message/${req.params.to_userId}`);
//     })
//     .catch(err => {
//         console.log('***** Error in deleting message *****:', err);
//         res.json({ message: '***** ERROR *****'});
//     });
// });