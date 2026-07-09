const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name. Every category needs a name!'],
      unique: true,
      trim: true,   
      minlength: [3, 'A category name must have at least 3 characters.']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description. Tell us what is in this category!'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
