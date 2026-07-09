const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('../config/db');

dotenv.config();

const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    await connectDB();

    console.log('--- Database Cleanup Started ---');
    await Category.deleteMany();
    console.log('All categories deleted.');
    
    await Product.deleteMany();
    console.log('All products deleted.');
    
    await Cart.deleteMany();
    console.log('All carts deleted.');
    
    await Order.deleteMany();
    console.log('All orders deleted.');
    
    console.log('--- Database Cleanup Completed ---\n');

    console.log('--- Seeding Categories Started ---');
    const categoriesData = [
      {
        name: 'Electronics',
        description: 'Gadgets, devices, and high-tech computing accessories.'
      },
      {
        name: 'Books',
        description: 'Educational, fiction, and non-fiction reading materials.'
      },
      {
        name: 'Clothing',
        description: 'Stylish apparel, comfortable shoes, and accessories.'
      }
    ];

    const seededCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${seededCategories.length} categories.`);
    
    const categoryMap = {};
    seededCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });
    console.log('--- Seeding Categories Completed ---\n');

    console.log('--- Seeding Products Started ---');
    const productsData = [
      {
        name: 'Gaming Laptop',
        description: 'High-performance laptop with 16GB RAM and RTX Graphic Card.',
        price: 999.99,
        stock: 10,
        category: categoryMap['Electronics']
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic 2.4GHz wireless mouse with adjustable DPI.',
        price: 24.99,
        stock: 50,
        category: categoryMap['Electronics']
      },
      {
        name: 'Introduction to Algorithms',
        description: 'A comprehensive guide to understanding programming algorithms.',
        price: 59.99,
        stock: 30,
        category: categoryMap['Books']
      },
      {
        name: 'Sci-Fi Novel',
        description: 'An exciting space odyssey set in the year 3000.',
        price: 12.99,
        stock: 100,
        category: categoryMap['Books']
      },
      {
        name: 'Cotton Hoodie',
        description: 'Super soft, warm fleece hoodie. Perfect for winter.',
        price: 39.99,
        stock: 25,
        category: categoryMap['Clothing']
      },
      {
        name: 'Running Sneakers',
        description: 'Lightweight and breathable sneakers with shock absorption.',
        price: 79.99,
        stock: 15,
        category: categoryMap['Clothing']
      }
    ];

    const seededProducts = await Product.insertMany(productsData);
    console.log(`Seeded ${seededProducts.length} products.`);
    console.log('--- Seeding Products Completed ---\n');

    console.log('Database seeding completed successfully!');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed with error: ${error.message}`);
    await disconnectDB();
    process.exit(1);
  }
};

seedData();
