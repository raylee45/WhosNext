require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;
const mongoose = require('mongoose');

const Messages = require('../models/message');
const User = require('../models/user')
const Match = require('../models/match')

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('=====> Inside GET /matches')
    try {
        User.findAll(req.params.id)
    }
    .then((matched)=> {
        User.
    })

});

router.delete('/', (req, res) => {
    Match.findByIdAndRemove(req.params.id)
    .then(response => {
        console.log('Match was deleted', response);
        res.json({ message: `Match ${req.params.id} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});


//As a user i must be able to signup and login process
//As a user i must be able to show homepage the ilst of all user 
//As a user imust be able to choose one of them as my match
//As a user I must be able to edit that match
//As a user I must be able to delete the user
//Search bar to show name
//list of user with a match button in front of each user

//user put data into the matches array

//after user login see the list users already see the database (no match)
//each user name add a button in the front name that says match
//press the match button goes to the list of matches array 
