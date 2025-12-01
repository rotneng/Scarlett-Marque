const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    trim: true,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  category: {
    type: String,
    required: true,
    trim: true,
  },
  sizes: {
    type: String,
    default: [],
    trim: true,
  },
  colors: {
    type: String, 
    trim: true,
    default: [],
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },

  image: {
    type: String,
  },

},{ timestamps: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
