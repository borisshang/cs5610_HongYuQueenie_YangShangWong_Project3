const Schema = require('mongoose').Schema;

exports.BlogpostSchema = new Schema({
    owner: {
        type: String,
        unique: true
    },
    text: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { collection : 'postTable' });

