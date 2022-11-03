const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    name: String,
    completed: Boolean,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
