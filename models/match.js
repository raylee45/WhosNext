const mongoose = require('mongoose');
const { Schema } = mongoose;

const matchSchema = new Schema({
    matchedUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
}); 

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;