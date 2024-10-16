// --> Importing Required Models <--
const User = require('../models/User')
const Property = require('../models/Property')



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

exports.changeOwner = async (req, res) => {
  try {
    const { propertyId, newOwnerId } = req.body;

    console.log('propertyId', propertyId)
    console.log('newOwnerId', newOwnerId)

    // Validate required fields
    if (!propertyId || !newOwnerId) {
      return res.status(400).json({
        success: false,
        message: "Property ID and new owner ID are required",
      });
    }

    // Fetch the property by ID
    const property = await Property.findById(propertyId).populate('listedBy');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Check if the new owner is already the current owner
    console.log('property.listedBy._id', property.listedBy._id)
    console.log('newOwnerId', newOwnerId)

    if (property.listedBy._id.toString() === newOwnerId) {
      return res.status(400).json({
        success: false,
        message: "User is already the owner of this property",
      });
    }

    // Update the listedBy field to the new owner ID
    property.listedBy = newOwnerId;
    await property.save();

    res.status(200).json({
      success: true,
      message: "Owner changed successfully",
      property,
    });

  } catch (error) {
    console.error("Error while changing property owner", error.message);

    res.status(500).json({
      success: false,
      message: "Error while changing property owner",
    });

    throw error;
  }
};
