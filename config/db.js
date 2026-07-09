const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
    try {
        let connURI = process.env.MONGO_URI || '';
        console.log(`Checking MongoDB database status at: ${connURI}...`);

        try {
            await mongoose.connect(connURI, {
                serverSelectionTimeoutMS: 2000
            });
            console.log(`MongoDB database connected successfully to: ${mongoose.connection.host}`);
        } catch (connError){
            console.log(`Local MongoDB service is offline or refused connection (Reason: ${connError.message}).`)
            console.log(`Attempting to start a local MongoDB service...`);
            const { MongoMemoryServer } = require('mongodb-memory-server');
            mongod = await MongoMemoryServer.create({
                binary: {
                    version: '6.0.5'
                }
            });
            
            connURI = mongod.getUri();
            await mongoose.connect(connURI, {
                serverSelectionTimeoutMS: 2000
            });
            console.log(`MongoDB database connected successfully to: ${mongoose.connection.host}`);
        }
    } catch (error){
        console.error(`Error connecting to MongoDB database: ${error.message}`);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        if (mongod) {
            await mongod.stop();
            console.log('Local MongoDB service stopped.');
    }
    } catch (error) {
        console.error(`Error disconnecting from MongoDB database: ${error.message}`);
    }
};
 module.exports = { connectDB, disconnectDB };