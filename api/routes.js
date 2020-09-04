
'use strict';

module.exports = function (app) {
    let usersList = require('../controllers/UserController');
    let fileUpload = require('../controllers/FileUploadController');
    let groupController = require('../controllers/GroupController');

    app.get('/', (req, res) => {
        res.sendFile(require('path').dirname(process.mainModule.filename) + "/index.html");
    });
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


};