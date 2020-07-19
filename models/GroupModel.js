'use strict';
const mongoose = require('mongoose');
const GroupUserModel = require('./GroupUserModel').schema;
const Schema = mongoose.Schema;


const GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: [GroupUserModel],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: [0, 1, 2, 3, 4]
        }],
        default: [1]
    }
});

module.exports = mongoose.model('Groups', GroupSchema);