'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly Enter The Name'
    },
    phone: {
        type: String,
        required: "Kindly Enter Phone",
        unique: true
    },
    countryCode: {
        type: String,
        default: "+91"
    },
    profilePic: {
        type: String,
    },
    about: {
        type: String,
        default: "Hey There, I am using MadApp"
    },
    groups: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: [0, 1, 2, 3, 4],
        default: 1
    },
    deviceToken: {
        type: String,
    }
});

module.exports = mongoose.model('Users', UserSchema);