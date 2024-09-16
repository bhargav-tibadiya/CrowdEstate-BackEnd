// --> Importing All Dependancy <--
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")


// --> Importing Required Models <--
const User = require('../models/User')
const OTP = require('../models/OTP')


// --> Setting Up the Environment Variables <--
require(('dotenv')).config()


// --> Function for Sending OTP <--
exports.sendotp = async (req, res) => {

  // TODO : Add email Validation

  try {

    // Fetch Data from Request Body
    const { email } = req.body

    // Checking if User Exist in DB
    const checkUserPresent = await User.findOne({ email })

    // If User Exist then rreturn a Response of "User Exist" 
    if (checkUserPresent) {
      return res.status(401).json({
        success: true,
        message: "User Already Exist Please Login"
      })
    }

    // If User Doesn't Exist then Generate OTP 
    const otpOptions = {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    };

    var otp = otpGenerator.generate(6, otpOptions)
    console.log("OTP Generated : ", otp);

    // Check if Generated OTP Already Exist or not 
    const checkOTPPresent = await OTP.findOne({ otp: otp });

    // If we find OTP wee keep generating new OTP
    while (checkOTPPresent) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
      })
    }

    // Create a Entry in DB
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload);
    console.log('otpBody', otpBody)

    // Return a Successful Response
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully ",
      otp: otp
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error While Sending OTP",
    })
    console.log("Error While Sending OTP. \nCheck Auth.js File #BE004");
    console.error(error.message);
    throw error;

  }
}


// --> Function for Signup <--
exports.signup = async (req, res) => {

  try {

    // Fetch Data From Request Body
    const {
      username,
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      contactNumber,
      role,
      isVerified,
      otp
    } = req.body

    // Validate Data
    const isDataMissing = (!username || !firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp)

    if (isDataMissing) {
      console.log("Some Data are Missing \nCheck Auth.js File #BE004");
      return res.status(403).json({
        success: false,
        message: "Please Fill All Fields, Some Data are Missing",
      })
    }

    // Match if Both Password Match
    if (password != confirmPassword) {

      console.log("Password and Confirm Passwords noth Matching \nCheck Auth.js File #BE005");

      return res.status(400).json({
        success: false,
        message: "Password and Confirm Passwords noth Matching",
      })
    }

    // Check if User Already Exist
    const userExist = await User.findOne({ email })

    console.log("User Already Exist Please Login \nCheck Auth.js File #BE006");

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist Please Login",
      })
    }

    // Find most Recent OTP for the User ( using sort we are sorting to most recent otp and selecting top )
    // const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    const recentOtp = await OTP.findOne({ email });
    console.log("Selected Recent OTP from DB: ", recentOtp);

    console.log('otp', otp)
    console.log('recentOtp', recentOtp)
    console.log('recentOtp.otp', recentOtp.otp)

    // Validate OTP
    if (recentOtp.length == 0) {

      // OTP not found
      console.log("OTP not found in DB \nCheck Auth.js File #BE007");

      return res.status(400).json({
        success: false,
        message: "OTP Not Found in DB",
      })


    } else if (otp !== recentOtp.otp) {

      // OTP doesnt match
      console.log("OTP Doesnt Match & Invalid OTP \nCheck Auth.js File #BE008");

      return res.status(400).json({
        success: false,
        message: "OTP Doesnt Match",
      })

    }

    // Hash Password with Bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);


    // We will insert ObjectID of Profile
    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      phone: contactNumber,
      password: hashedPassword,
      role,
      isVerified,
      profileImage: `https://api.dicebear.com/5.x/initials/svg?seed=?${firstName} ${lastName}`
    })

    // Return Response
    res.status(200).json({
      success: true,
      message: "User Registered Successfully ",
      user: user
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error While Creating Account",
    })

    console.log("Error While Creating Account. \nCheck Auth.js File #BE009");
    console.error(error.message);
    throw error;

  }

}


// --> Function for login <--
exports.login = async (req, res) => {
  try {

    // Fetch Data from Request Body
    const { email, password } = req.body

    // Validate the Data
    const isDataMissing = (!email || !password)

    if (isDataMissing) {
      console.log("Data is Missing \nCheck Auth.js File #BE010");

      return res.status(403).json({
        success: false,
        message: "Please Fill All Fields, Some Data are Missing",
      })
    }

    // Check if User Exist or Not
    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      console.log("User Not Found \nCheck Auth.js File #BE011");

      return res.status(401).json({
        success: false,
        message: "User Not Found. Please SignUp",
      })
    }

    // Generate JWT and Store after Matching Password
    if (await bcrypt.compare(password, user.password)) {

      const payload = {
        id: user._id,
        email: user.email,
        accountType: user.accountType
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h",
      })

      user.token = token;
      user.password = undefined;


      // Generate cookie and Send Response
      const cookieConfig = {
        path: '/',
        expires: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      }

      res.header('Access-Control-Allow-Origin', process.env.FRONT_END_URL);
      res.cookie("token", token, cookieConfig).status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        user: user
      })

      console.log('Cookie Set Success');

    } else {

      res.status(401).json({
        success: false,
        message: "Password is Incorrect",
      })

      console.log("Password is Incorrect \nCheck Auth.js File #BE012");
    }


  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error While Login",
    })

    console.log("Error While Login. \nCheck Auth.js File #BE013");
    console.error(error.message);
    throw error;
  }
}