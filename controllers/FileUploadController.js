'use strict';


const multer = require('multer');
const path = require('path');


// SET MUTLER STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    console.log("FILE_DETAILS : ", file)
    cb(null, file.originalname)
  }
})

exports.upload = multer({ storage: storage })
exports.uploadFiles = (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    const payload = {
      success: false,
      error:error.message
    }
    return res.status(400).json(payload);
  }
  res.json(files)

}