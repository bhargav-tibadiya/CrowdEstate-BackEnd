// --> Importing the Dependacies <--
const mongoose = require('mongoose');


// --> Defining Schema <--
const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    enum: [
      'Available',
      'Sold',
      'Under Offer',
      'Rented',
      'Off Market'
    ],  
    required: true,
  },

  tags: {
    type: [String],
    enum: [
      'Luxury',
      'Affordable',
      'New',
      'Under Construction',
      'Fully Furnished',
      'Pet Friendly',
      'Near School',
      'Near Metro',
      'Gated Community',
      'Eco-Friendly',
      'Smart Home',
      'Waterfront',
      'Mountain View',
      'City Center',
      'Garden',
      'Swimming Pool'
    ]
  },

  images: {
    type: String,
    required: true,
  },

  listedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  isCollaborative: {
    type: Boolean,
    required: true,
  },

  maxContributors: {
    type: Number,
    required: function () {
      return this.isCollaborative;
    }
  },

  allContributors: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },

  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },

  propertyStatus: {
    type: String,
    enum: ['Available', 'Under Contract', 'Sold'],
    default: 'Available',
    required: true,
  },

  size: {
    type: Number,
    required: true,
  },

  bedrooms: {
    type: Number,
  },

  bathrooms: {
    type: Number,
  },

  yearBuilt: {
    type: Number,
  },

  listedAt: {
    type: Date,
    default: Date.now,
  },

  collaborativePrice: {
    type: Number,
  },

  expiryDate: {
    type: Date,
  },
})


// --> Export the model <--
module.exports = mongoose.model('Property', propertySchema);
