const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();
router
  .route('/')
  .get(cartController.getCart)
  .post(cartController.addToCart)
  .delete(cartController.clearCart);

router
  .route('/:productId')
  .put(cartController.updateCartItem)
  .delete(cartController.removeFromCart);

module.exports = router;