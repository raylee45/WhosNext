const mongoose = require('mongoose');
const { Schema } = mongoose;

const matchesSchema = new Schema({
    name: String,
    image: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;