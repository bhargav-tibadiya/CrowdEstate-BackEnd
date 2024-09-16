// --> Importing All Dependancy <--
const jwt = require("jsonwebtoken")


// --> Importing Required Models <--
const User = require('../models/User')


// --> Setting Up the Environment Variables <--
require(('dotenv')).config()


// auth
exports.auth = async (req, res, next) => {

  // to chech auth we check and verify jwt token 
  try {

    const token = req.cookies.token || req.body.token || req.header('authurization').replace("Bearer ", "")

    // if token is missing then show error
    if (!token) {

      console.log("Token is Missing \nCheck Middlewares/Auth.js File #BE014");
      return res.status(401).json({
        success: false,
        message: "Token is Missing",
      })
    }

    // verify the token
    try {

      const decode = await jwt.verify(token, process.env.JWT_SECRET)
      req.user = decode;

    } catch (error) {

      console.log("There is an issue Verifying Token \nCheck Middlewares/Auth.js File #BE015");
      return res.status(401).json({
        success: false,
        message: "There is an issue Verifying Token",
      })
    }

    next();

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error While Authentication",
    })

    console.log("Error While Authentication. \nCheck Middlewares/Auth.js File #BE016");
    console.error(error.message);
    throw error;

  }
}