const express = require('express');
const router = express.Router();

const {
  addProperty
} = require('../controllers/property');

// define API Routes

// Route for adding Propert
router.post('/addproperty', addProperty)


module.exports = router;