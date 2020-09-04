'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: [String],
        required: true,
    },
    adminList: {
        type: [String],
        required: true
    },
    profilePic: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: [0, 1, 2, 3, 4],
        default: 1
    }
});

module.exports = mongoose.model('Groups', GroupSchema);