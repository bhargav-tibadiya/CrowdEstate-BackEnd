// --> Importing Required Models <--
const User = require('../models/User')
const Property = require('../models/Property')
const nodeMailer = require('node-mailer')


// --> Setting Up the Environment Variables <--
require(('dotenv')).config()


exports.addProperty = async (req, res) => {

  try {

    const { address, bathrooms, bedrooms, category, city, coordinates, country, description, image, isCollaborative, listedBy, name, price, size, state, tags, yearBuilt } = req.body

    // Validate Dat!a ||    
    const isDataMissing = (!address || !bathrooms || !bedrooms || !category || !city || !coordinates || !country || !description || !image || !isCollaborative || !listedBy || !name || !price || !size || !state || !tags || !yearBuilt)

    if (isDataMissing) {
      console.log("Some Data are Missing \nCheck Property.js File #BE017");
      return res.status(403).json({
        success: false,
        message: "Please Fill All Fields, Some Data are Missing",
      })
    }

    // Find User who is Listing this property
    const checkUserPresent = await User.findById(listedBy)

    if (checkUserPresent) {

      const payload = {
        name: name,
        description: description,
        price: price,
        category: category,
        tags: tags,
        image: image,
        listedBy: listedBy,
        isCollaborative: isCollaborative,
        location: {
          address: address,
          city: city,
          state: state,
          country: country,
          coordinates: {
            lat: coordinates.lat,
            lng: coordinates.lng,
          },
        },
        size: size,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        yearBuilt: yearBuilt,
      }

      const property = await Property.create(payload);
      console.log('property', property)

      res.status(200).json({
        success: true,
        message: "Property Added SucessFully",
        property: property
      })

    }


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error While Adding Property",
    })
    console.log("Error While Adding Property. \nCheck Property.js File #BE018");
    console.error(error.message);
    throw error;

  }

}

exports.showProperties = async (req, res) => {

  try {

    const { userId } = req.body

    if (!userId) {
      console.log("Some Data are Missing \nCheck Property.js File #BE020");
      return res.status(403).json({
        success: false,
        message: "Please Fill All Fields, Some Data are Missing",
      })
    }

    const response = await Property.find({ listedBy: userId });
    console.log('response', response)

    res.status(200).json({
      success: true,
      message: "Property Added SucessFully",
      properties: response
    })


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error While fetching all Property",
    })
    console.log("Error While fetching all Property. \nCheck Property.js File #BE019");
    console.error(error.message);
    throw error;

  }

}

exports.fetchAllProperties = async (req, res) => {

  try {

    const response = await Property.find();
    console.log('response', response)

    res.status(200).json({
      success: true,
      message: "All Prroperties Fetched Successfully",
      properties: response
    })


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error While fetching all Property",
    })
    console.log("Error While fetching all Property. \nCheck Property.js File #BE021");
    console.error(error.message);
    throw error;

  }

}

exports.getProperty = async (req, res) => {

  try {

    console.log('req.body', req.body)

    const { id } = req.body

    console.log('id', id)

    const response = await Property.find({ _id: id });
    console.log('response', response)

    res.status(200).json({
      success: true,
      message: "Properties Fetched Successfully",
      property: response
    })


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error While fetching Property",
    })
    console.log("Error While fetching Property. \nCheck Property.js File #BE022");
    console.error(error.message);
    throw error;

  }
}