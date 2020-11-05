'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OtpSchema = new Schema({
    phone: {
        type: String,
        required: "Kindly Enter Phone",
        unique: true
    },
    countryCode: {
        type: String,
        default: "+91"
    },
    otp: {
        type: String
    },
    otpDate: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Otps', OtpSchema);

