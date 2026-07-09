const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const calculateCartTotal = async (cart) => {
    let total = 0;
    await cart.populate('items.product');
    cart.items.forEach((item) => {
        if (item.product) {
            total += item.product.price * item.quantity;
        }
    });
    cart.totalPrice = Math.round(total * 100) / 100;
};


exports.getCart = asyncHandler(async (req, res, next) => {
    let cart = await Cart.findOne({userId: 'defaultUserId'}).populate('items.product');
    if (!cart){
        cart = await Cart.create({userId: 'defaultUserId', items: [], totalPrice: 0});
    }

    res.status(200).json({
        status: 'success',
        data: {
            cart
        }
    });
});

exports.addToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const quantityToAdd = Number(quantity) || 1;

    if (quantityToAdd <= 0) {
        return next(new AppError('Quantity must be greater than zero.', 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError('Product not found.', 404));
    }
})

let cart = await Cart.findOne({userId: 'defaultUserId'});
if (!cart) {
    cart = await Cart.create({userId: 'defaultUserId', items: [], totalPrice: 0});
}

const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
);

if (itemIndex > -1) {
    const newQuantity = cart.items[itemIndex].quantity + quantityToAdd;
    if (newQuantity > product.stock) {
        return next(
            new AppError(
                `cannot add ${quantityToAdd} more of this item. you already have ${cart.items[itemIndex].quantity} in your cart, and the stock is ${product.stock}.`,
            )
        )
    }
    cart.items[itemIndex].quantity = newQuantity;
} else {
if (quantityToAdd > product.stock) {
      return next(
        new AppError(
          `Cannot add ${quantityToAdd} item(s) to cart. Only ${product.stock} left in stock.`,
          400
        )
      );
    }

    cart.items.push({ product: productId, quantity: quantityToAdd });
  }


  await calculateCartTotal(cart);
  await cart.save();

  await cart.populate('items.product');

  res.status(200).json({
    status: 'success',
    message: 'Product added to cart successfully.',
    data: {
      cart
    }
  });


exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const newQuantity = Number(req.body.quantity);

  if (!newQuantity || newQuantity <= 0) {
    return next(new AppError('Quantity must be at least 1. To remove an item, use the delete method.', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('No product found with that ID.', 404));
  }

  if (newQuantity > product.stock) {
    return next(
      new AppError(
        `Cannot update quantity to ${newQuantity}. Only ${product.stock} items left in stock.`,
        400
      )
    );
  }
  const cart = await Cart.findOne({ userId: 'default_user' });
  if (!cart) {
    return next(new AppError('No cart found for this user.', 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new AppError('Product not found in your cart.', 404));
  }


  cart.items[itemIndex].quantity = newQuantity;
  await calculateCartTotal(cart);
  await cart.save();

  await cart.populate('items.product');

  res.status(200).json({
    status: 'success',
    message: 'Cart item updated successfully.',
    data: {
      cart
    }
  });
});


exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId: 'default_user' });
  if (!cart) {
    return next(new AppError('No cart found for this user.', 404));
  }


  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId
  );

  if (!itemExists) {
    return next(new AppError('Product not found in your cart.', 404));
  }


  cart.items = cart.items.filter((item) => item.product.toString() !== productId);

  
  await calculateCartTotal(cart);
  await cart.save();

  await cart.populate('items.product');

  res.status(200).json({
    status: 'success',
    message: 'Product removed from cart successfully.',
    data: {
      cart
    }
  });
});


exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: 'default_user' });
  
  if (!cart) {
    return next(new AppError('No cart found for this user.', 404));
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Cart cleared successfully.',
    data: {
      cart
    }
  });
});



