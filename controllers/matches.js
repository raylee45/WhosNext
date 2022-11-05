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

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('=====> Inside GET /matches')
    User.findById(req.params.id)
    .then(foundUsers => {
        res.json({ user: foundUsers });
    })
    .catch(err => {
        console.log('Error in user#index:', err);
        res.json({ message: 'Error occured... Please try again.'})
    });
});

