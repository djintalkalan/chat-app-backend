
'use strict';

module.exports = function (app) {
    let usersList = require('../controllers/UserController');
    let OtpController = require('../controllers/OtpController');
    let fileUpload = require('../controllers/FileUploadController');
    let groupController = require('../controllers/GroupController');
    let path = require('path');

    // app.get('/', (req, res) => {
    //     res.sendFile(path.dirname(process.mainModule.filename) + "/index.html");
    // });

    app.get('/download/:name', (req, res) => {
        res.sendFile(path.resolve(`${__dirname}/../uploads/` + req.params.name));
    });

    app.get('/photo/:id', (req, res) => {
        var filename = req.params.id;

        db.collection('mycollection').findOne({ '_id': ObjectId(filename) }, (err, result) => {

            if (err) return console.log(err)

            res.contentType('image/jpeg');
            res.send(result.image.buffer)


        })
    })

    app.route('/sync-contacts')
        .post(usersList.sync_contacts);

    app.route('/get-users')
        .get(usersList.get_users);

    app.route('/remove-users')
        .delete(usersList.remove_users);

    app.route('/login')
        .post(usersList.login);

    app.route('/create-group')
        .post(groupController.createGroup);

    app.route('/get-group')
        .post(groupController.get_group);

    app.route('/upload-files').post(fileUpload.upload.array('myFile', 100), fileUpload.uploadFiles)

    app.route('/send-otp')
        .post(OtpController.send_otp);

    app.route('/verify-otp')
        .post(OtpController.verify_otp)



};