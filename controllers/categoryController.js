const Category = require('../models/Category');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');


exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});


exports.createCategory = asyncHandler(async (req, res, next) => {
  const newCategory = await Category.create({
    name: req.body.name,
    description: req.body.description
  });

  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory
    }
  });
});


exports.updateCategory = asyncHandler(async (req, res, next) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,          
      runValidators: true 
    }
  );

  if (!updatedCategory) {
    return next(new AppError('No category found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category: updatedCategory
    }
  });
});


exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;


  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new AppError('No category found with that ID.', 404));
  }

  const productsCount = await Product.countDocuments({ category: categoryId });
  if (productsCount > 0) {
    return next(
      new AppError(
        `Cannot delete category "${category.name}" because it is currently linked to ${productsCount} product(s). Please delete or update those products first!`,
        400
      )
    );
  }

  await Category.findByIdAndDelete(categoryId);

  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully.',
    data: null
  });
});
