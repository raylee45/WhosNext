// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;

// DB Models
const Users = require('../models/user');

// put this inside route to authenticate -> passport.authenticate('jwt', { session: false })
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Purpose: Fetch all users from DB and return
    res.json({ message: 'User endpoint OK! ✅' });
    console.log('=====> Inside GET /users');

    Users.findById(req.params.id)
    .then(foundUsers => {
        res.json({ user: foundUsers });
    })
    .catch(err => {
        console.log('Error in user#index:', err);
        res.json({ message: 'Error occured... Please try again.'})
    });
}); 

router.post('/signup', (req, res) => {
    // POST - adding the new user to the database
    console.log('===> Inside of /signup');
    console.log('===> /register -> req.body',req.body);

    Users.findOne({ email: req.body.email })
    .then(users => {
        // if email already exists, a user will come back
        if (users) {
            // send a 400 response
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            // Create a new user
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                about: req.body.about,
                dob_day: req.body.dob_day,
                dob_month: req.body.dob_month,
                dob_year: req.body.dob_year,
                gender: req.body.gender,
                preference: req.body.preference,
                image: req.body.image,
            });

            // Salt and hash the password - before saving the user
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw Error;

                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) console.log('==> Error inside of hash', err);
                    // Change the password in newUser to the hash
                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => res.json({ user: createdUser}))
                    .catch(err => {
                        console.log('error with creating new user', err);
                        res.json({ message: 'Error occured... Please try again.'});
                    });
                });
            });
        }
    })
    .catch(err => { 
        console.log('Error finding user', err);
        res.json({ message: 'Error occured... Please try again.'})
    })
});

router.post('/login', async (req, res) => {
    // POST - finding a user and returning the user
    console.log('===> Inside of /login');
    console.log('===> /login -> req.body', req.body);

    const foundUser = await Users.findOne({ email: req.body.email });

    if (foundUser) {
        // user is in the DB
        let isMatch = await bcrypt.compare(req.body.password, foundUser.password);
        console.log('Does the passwords match?', isMatch);
        if (isMatch) {
            // if user match, then we want to send a JSON Web Token
            // Create a token payload
            // add an expiredToken = Date.now()
            // save the user
            const payload = {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name
            }

            jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                    res.status(400).json({ message: 'Session has endedd, please log in again'});
                }
                const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
                console.log('===> legit', legit);
                res.json({ success: true, token: `Bearer ${token}`, userData: legit });
            });

        } else {
            return res.status(400).json({ message: 'Email or Password is incorrect' });
        }
    } else {
        return res.status(400).json({ message: 'User not found' });
    }
});


router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('====> inside /profile');
    console.log(req.body);
    console.log('====> user')
    console.log(req.user);
    const { id, name, email, about, gender, preference, image } = req.user; // object with user object inside
    res.json({ id, name, email, about, gender, preference, image });
});

router.put('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    const formData = req.body.formData
    const query = {user_id: formData.user_id}
    console.log(query)
    const insertedUser = User.findByIdAndUpdate(query, updateDocument, { upsert: true })
    const updateDocument = {
        $set: {
            first_name: formData.first_name,
            gender: formData.gender,
            preference: formData.preference,
            image: formData.image,
            about: formData.about,
            matches: formData.matches
        },
    }
    res.json(insertedUser)
    if (err) return res.send(500, {error: err});
    return res.send('Successfully updated')
});

router.delete('/:id', (req, res) => {
    Users.findByIdAndRemove(req.params.id)
    .then(response => {
        console.log('User was deleted', response);
        res.json({ message: `User ${req.params.id} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

// Exports
module.exports = router;