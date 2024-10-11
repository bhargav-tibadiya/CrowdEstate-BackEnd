// --> Importing All Dependancy <--
const express = require("express")
const router = express.Router()

// --> Import the required controllers and middleware functions <--
const {
  login,
  signup,
  sendotp,
  findUser
} = require("../controllers/Auth")


// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp)

// Route for Getting User info
router.post("/getuser", findUser)


// Export the router for use in the main application
module.exports = router