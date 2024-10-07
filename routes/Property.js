const express = require('express');
const router = express.Router();

const {
  addProperty,
  showProperties
} = require('../controllers/property');

// define API Routes

// Route for adding Propert
router.post('/addproperty', addProperty)
router.post('/showproperties', showProperties)


module.exports = router;