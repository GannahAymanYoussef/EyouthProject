const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config();

const app = require('./app');
const { connectDB } = require('./config/db');

connectDB();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`===============================================`);
  console.log(`Server is running in ${process.env.NODE_ENV} mode`);
  console.log(`Listening on port: ${port}`);
  console.log(`API URL: http://localhost:${port}`);
  console.log(`===============================================`);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down gracefully...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
