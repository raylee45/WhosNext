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
    User.findById(req.user.id).populate('matches').exec()
    .then(user => {
        if (user.matches.length === 0) {
            res.json({ user: user, matches: "No current matches" })
        } else {
            console.log('this is the user', user);
            let matches = [...user.matches];
            delete user.matches;
            res.json({ user: user, matches: matches });
        }
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

router.post('/create',  passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.user.id)
    .then(user => {
        user.matches = user.matches.filter(u => u === null ? false : true);
        const searchIndex = user.matches.findIndex((person) => person._id==req.body.data.matchId);
        if (searchIndex === -1) {
            res.json({ message: `person is already a match`})
        };
        if (searchIndex > -1) {
            res.json({ message: `${person.name} is already a match`});
        } else {
            User.findById(req.body.data.matchId)
            .then(matchUser => {
                user.matches.push(matchUser);
                user.save();
                res.json({ message: `${matchUser.name} is now saved as a match` });
            })
        }
        // res.redirect('/matches'); something along these lines
        })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
})

module.exports = router