'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GroupUserSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: 'Kindly Enter The Name'
    },
    isAdmin: {
        type: Boolean,
        default: false
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
    about: {
        type: String,
        default: "Hey There, I am using MadApp"
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: [0, 1, 2, 3, 4]
        }],
        default: [1]
    },
    lastOnline: {
        type: Date,
    }
}, { _id: false });

module.exports = mongoose.model('GroupUsers', GroupUserSchema);