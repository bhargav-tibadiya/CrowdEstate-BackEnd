const express = require('express');
const router = express.Router();

const {
  purchaseProperty,
  addTransaction
} = require('../controllers/purchase');

// define API Routes

// Route for adding Propert
router.post('/buy', purchaseProperty)
router.post('/addtransaction', addTransaction)

module.exports = router;