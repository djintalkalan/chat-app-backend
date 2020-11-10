'use strict';
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    senderPhone: {
        type: String,
        required: true
    },
    receiverPhone: {
        type: String,
        required: true
    },
    isGroup: {
        type: String,
        default: false
    },
    groupId: {
        type: ObjectId,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String,
    },
    isSticker: {
        type: Boolean,
        default: false
    },
    tempId: {
        type: String,
    },
    status: {
        type: String,
        enum: [0, 1, 2, 3, 4],
        default: 0
    },
    groupStatusReceived: {
        type: [String],
        default: []
    },
    groupStatusRead: {
        type: [String],
        default: []
    },
    serverAttachment: {
        type: String,
    }
});

module.exports = mongoose.model('Chats', MessageSchema);