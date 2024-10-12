const express = require('express');
const router = express.Router();

const {
  addProperty,
  showProperties,
  fetchAllProperties,
  getProperty,
  changeOwner
} = require('../controllers/property');

// define API Routes

// Route for adding Propert
router.post('/addproperty', addProperty)
router.post('/showproperties', showProperties)
router.post('/fetchallproperties', fetchAllProperties)
router.post('/getproperty', getProperty)
router.post('/changeowner', changeOwner)


module.exports = router;