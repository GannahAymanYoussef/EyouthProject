const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'A cart item must reference a product.']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required.'],
    min: [1, 'Quantity cannot be less than 1. Please add at least 1 item.'],
    default: 1,
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number (integer).'
    }
  }
});
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'default_user', 
      required: true,
      unique: true 
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
