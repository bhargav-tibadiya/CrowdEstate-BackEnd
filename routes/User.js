// --> Importing All Dependancy <--
const express = require("express")
const router = express.Router()

// --> Import the required controllers and middleware functions <--
const {
  login,
  signup,
  sendotp,
} = require("../controllers/Auth")


// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp)


// Export the router for use in the main application
module.exports = router