'use strict';

let mongoose = require('mongoose');
let Otp = mongoose.model('Otps');
const fetch = require("node-fetch");
const moment = require('moment');

exports.send_otp = (req, res) => {
  Otp.findOne({ phone: req.body.phone }, (err, result) => {
    console.log("Error", err)
    console.log("Result", result)
    if (err) {
      const payload = {
        success: false,
        error: err
      }
      return res.status(500).json(payload);
    }
    if (result) {
      let thisDate = moment();
      let addedOtpDate = moment(result.otpDate).add(20, 'minutes');
      let otp = result.otp;

      if (addedOtpDate < thisDate) {
        let otp = Math.floor(1000 + Math.random() * 9000);
        let otpDate = Date.now()
        console.log("changedDate", thisDate)
        Otp.updateOne({ phone: req.body.phone }, {
          "otp": otp, "otpDate": otpDate
        }, (err, raw) => {
          callSendOTPApi(req.body.phone, otp);
        })
      }
      else callSendOTPApi(req.body.phone, otp);
      const payload = {
        message: "Otp sent successfully",
        success: true
      }
      // console.log("Payload", payload)
      res.json(payload);
    }
    else {
      let otp = Math.floor(1000 + Math.random() * 9000);
      let newOtp = new Otp({
        ...req.body,
        otp: otp,
        otpDate: Date.now()
      })

      newOtp.save((error, response) => {
        if (error) {
          const payload = {
            data: null,
            success: false,
            error
          }
          return res.status(500).json(payload);
        }
        callSendOTPApi(req.body.phone, otp);
        const payload = {
          message: "Otp sent successfully",
          success: true
        }
        console.log(payload)
        res.json(payload);
      });
    }

  })
}

exports.verify_otp = (req, res) => {
  Otp.findOne({ phone: req.body.phone }, (err, result) => {
    if (err) {
      const payload = {
        success: false,
        error: err,
        message: "Please send OTP again"
      }
      return res.status(500).json(payload);
    }
    if (result) {
      let thisDate = moment();
      let addedOtpDate = moment(result.otpDate).add(20, 'minutes');
      let otp = result.otp;
      let payload = {}
      if (addedOtpDate > thisDate) {
        if (otp == req.body.otp) {
          payload = {
            success: true,
            message: "Verified"
          }
        }
        else {
          payload = {
            success: false,
            message: "Wrong OTP"
          }
        }
      } else {
        payload = {
          success: false,
          message: "OTP Expired"
        }
      }
      res.json(payload)
    }
  })
}

const callSendOTPApi = (phone, otp) => {
  console.log("OTP IS "+otp)
  //return
  let message = "Your MadApp code is " + otp + " \nDon't share this code with others.";
  let URL = "http://hissarsms.com/API/SMSHttp.aspx?UserId=vinayasija&pwd=pwd2020&Message=" + message + "&Contacts=" + phone + "&SenderId=MAADAP&ServiceName=SMSOTP"
  fetch(URL)
    .then(
      (response) => {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then((data) => {
          console.log(data);
        });
      }
    )
    .catch((err) => {
      // console.log('Fetch Error :-S', err);
    });
}