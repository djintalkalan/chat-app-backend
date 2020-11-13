'use strict';


let mongoose = require('mongoose');
const { ObjectId, ObjectID } = require('mongodb');
let User = mongoose.model('Users');
let Group = mongoose.model('Groups');


exports.get_groups = (req, res) => {
  Group.find({}, (err, result) => {
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

exports.get_group = (req, res) => {
  Group.findById( req.body.phone, (err, result) => {
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
    console.log("Get Group",payload)
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

exports.createGroup = (req, res) => {

  let newGroup = new Group(req.body)


  newGroup.save((error, response) => {
    console.error(error)

    if (error) {
      const payload = {
        data: null,
        success: false,
        error
      }
      return res.status(500).json(payload);
    }
    if (response._id) {
      User.update(
        { phone: { "$in": response.users } },
        { $push: { "groups": response._id } }, { "multi": true }).then((product) => {
        });

    }
    console.log(response)
    const payload = {
      data: response,
      success: true,
    }
    res.json(payload);
  })


  return;

}