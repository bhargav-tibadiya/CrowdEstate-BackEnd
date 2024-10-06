const express = require('express');
const router = express.Router();

const {
  imageUpload,
  videoUpload,
  imageReducerUpload
} = require('../controllers/fileUpload');

// define API Routes

// Route for uploading Image
router.post('/imageUpload', imageUpload)

// Route for uploading Video
router.post('/videoUpload', videoUpload)

// Route for uploading Image With Compression
router.post('/imageReducerUpload', imageReducerUpload)

module.exports = router;