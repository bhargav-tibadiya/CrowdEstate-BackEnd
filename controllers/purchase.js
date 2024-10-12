// --> Importing Dependancy <--
const Razorpay = require('razorpay')

// --> Importing Required Models <--
const Transaction = require('../models/Transaction')


// --> Setting Up the Environment Variables <--
require(('dotenv')).config()

exports.purchaseProperty = async (req, res) => {
  try {

    const { amount } = req.body

    const razorpay = new Razorpay({
      key_id: process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    })

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `RC-${Date.now()}`,
      payment_capture: 1
    }

    const response = await razorpay.orders.create(options)

    console.log('response', response)

    res.status(200).json({
      success: true,
      message: "Purchase Confirmed Success",
      response: response
    })


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error While Purchasing Property",
    })
    console.log("Error While Purchasing Property. \nCheck Property.js File #BE025");
    console.error(error.message);
    throw error;

  }
}

exports.addTransaction = async (req, res) => {
  try {

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, userId, propertyId } = req.body

    const payload = {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      amount: amount,
      userId: userId,
      propertyId: propertyId
    }

    const response = await Transaction.create(payload)

    console.log('response', response)

    res.status(200).json({
      success: true,
      message: "Purchase Confirmed Success",
      response: response
    })


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error While Purchasing Property",
    })
    console.log("Error While Purchasing Property. \nCheck Purchase.js File #BE024");
    console.error(error.message);
    throw error;

  }
}