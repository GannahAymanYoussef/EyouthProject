const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router
  .route('/')
  .get(orderController.getOrders)
  .post(orderController.checkout);

router.route('/:id').get(orderController.getOrder);

router.route('/:id/status').put(orderController.updateOrderStatus);

module.exports = router;