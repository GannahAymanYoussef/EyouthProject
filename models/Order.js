const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Order item must link to a product.']
  },
  name: {
    type: String,
    required: [true, 'Order item must have a product name at checkout.']
  },
  price: {
    type: Number,
    required: [true, 'Order item must record the product price at checkout.'],
    min: [0, 'Price cannot be negative.']
  },
  quantity: {
    type: Number,
    required: [true, 'Order item must record the quantity purchased.'],
    min: [1, 'Quantity must be at least 1.']
  }
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'default_user',
      required: true
    },
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: [true, 'An order must have a total price.']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        message: 'Status must be either: pending, processing, shipped, delivered, or cancelled.'
      },
      default: 'pending'
    },
    shippingAddress: {
      type: String,
      required: [true, 'Please provide a shipping address. We need to know where to ship your items!'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
