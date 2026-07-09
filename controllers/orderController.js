const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');


exports.checkout = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;

  if (!shippingAddress) {
    return next(new AppError('Please provide a shipping address for the order.', 400));
  }


  const cart = await Cart.findOne({ userId: 'default_user' }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return next(
      new AppError('Your cart is empty. Please add items to your cart before placing an order.', 400)
    );
  }

  const orderItems = [];

 
  for (const item of cart.items) {
    const product = item.product;
    if (!product) {
      return next(new AppError('One of the products in your cart no longer exists.', 400));
    }

    if (product.stock < item.quantity) {
      return next(
        new AppError(
          `Insufficient stock for "${product.name}". Only ${product.stock} items are left in stock, but you requested ${item.quantity}. Please update your cart.`,
          400
        )
      );
    }


    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price, 
      quantity: item.quantity
    });
  }


  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    product.stock -= item.quantity;
    await product.save({ validateBeforeSave: true });
  }


  const order = await Order.create({
    userId: 'default_user',
    items: orderItems,
    totalPrice: cart.totalPrice,
    shippingAddress
  });


  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    status: 'success',
    message: 'Order placed successfully! Thank you for your purchase.',
    data: {
      order
    }
  });
});


exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});


exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('No order found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});


exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new AppError('Please provide the new status.', 400));
  }

  const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    return next(
      new AppError(
        `Invalid status. Status must be one of: ${allowedStatuses.join(', ')}`,
        400
      )
    );
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true
    }
  );

  if (!order) {
    return next(new AppError('No order found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `Order status updated to ${status} successfully.`,
    data: {
      order
    }
  });
});
