'use strict';


let mongoose = require('mongoose');
let User = mongoose.model('Users');



exports.sync_contacts = (req, res) => {
  var locs = req.body.contacts.map((x) => { return x.phone });
  User.find({ "phone": { "$in": locs } }, (err, result) => {
    if (err) {
      const payload = {
        data: null,
        success: false,
        error: err
      }
      return res.status(500).json(payload);
    }
    if (result) {
      const map = new Map();
      req.body.contacts.forEach(item => map.set(item.phone, item.name))
      result.forEach((item, index) => {
        result[index].name = map.get(item.phone)
      })
      const payload = {
        data: result,
        success: true
      }
      // console.log(payload)
      res.json(payload);
    }
  })
}

exports.get_users = (req, res) => {
  User.find({}, (err, result) => {
    if (err) {
      const payload = {
        error: err,
        success: false,
      }
      res.status(500).json(payload)
    }
    const payload = {
      data: result,
      success: true,
    }
    res.json(payload);
  });
};

exports.remove_users = (req, res) => {
  console.log("Body", req.body)

  User.remove({}, (err, result) => {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
}

exports.login = (req, res) => {
  console.log("Body", req.body)

  User.findOne({ phone: req.body.phone }, (err, result) => {
    console.log("RESULT", result)

    if (err) {
      const payload = {
        success: false,
        error: err
      }
      return res.status(500).json(payload);
    }
    if (result) {
      User.updateOne({ phone: req.body.phone }, {
        $set: { name: req.body.name }
      })
      const payload = {
        data: { ...result._doc, name: req.body.name },
        success: true
      }
      console.log("Payload", payload)
      res.json(payload);
    }
    else {
      let newUser = new User(req.body)
      newUser.save((error, response) => {
        if (error) {
          const payload = {
            data: null,
            success: false,
            error
          }
          return res.status(500).json(payload);
        }
        const payload = {
          data: response,
          success: true
        }
        console.log(payload)
        res.json(payload);
      });
    }
  })
}