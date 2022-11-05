const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    about: {
        type: String,
    },
    dob_day: {
        type: Number,
        required: true,
    },
    dob_month: {
        type: Number,
        required: true,
    },
    dob_year: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    preference: {
        type: String,
        required: true,
    },
    matches: [{
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
    }],
    image: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Users = mongoose.model('Users', userSchema);

module.exports = Users;