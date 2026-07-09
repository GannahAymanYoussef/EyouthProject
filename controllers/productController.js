const Product = require('../models/Product');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');


exports.getProducts = asyncHandler(async (req, res, next) => {

  const filterObject = {};

  const { category, minPrice, maxPrice, search } = req.query;

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filterObject.category = category;
    } else {
      const foundCategory = await Category.findOne({
        name: { $regex: category, $options: 'i' } 
      });
      if (foundCategory) {
        filterObject.category = foundCategory._id;
      } else {
        return res.status(200).json({
          status: 'success',
          results: 0,
          data: {
            products: []
          }
        });
      }
    }
  }
  if (minPrice || maxPrice) {
    filterObject.price = {};
    if (minPrice) {
      filterObject.price.$gte = Number(minPrice); 
    }
    if (maxPrice) {
      filterObject.price.$lte = Number(maxPrice);
    }
  }


  if (search) {
    filterObject.name = { $regex: search, $options: 'i' };
  }


  const products = await Product.find(filterObject).populate('category');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});


exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = 
  await Product.findById(req.params.id).populate('category');

  if (!product) {
    return next(new AppError('No product found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});


exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;


  if (!mongoose.Types.ObjectId.isValid(category)) {
    return next(new AppError('Invalid category ID format.', 400));
  }


  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(
      new AppError('The specified category does not exist. Please specify a valid category ID.', 400)
    );
  }


  const newProduct = await Product.create({
    name,
    description,
    price,
    category,
    stock
  });

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});


exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { category } = req.body;

  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return next(new AppError('Invalid category ID format.', 400));
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(
        new AppError('The specified category does not exist. Please specify a valid category ID.', 400)
      );
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('category');

  if (!updatedProduct) {
    return next(new AppError('No product found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product: updatedProduct
    }
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    return next(new AppError('No product found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully.',
    data: null
  });
});
