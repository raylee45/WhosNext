const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    from_userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    message: String,
    timestamp: String,
    to_userId: String,
});

const Messages = mongoose.model('Messages', messageSchema);

module.exports = Messages;