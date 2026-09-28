const mongoose = require('mongoose');

let isConnected = false;

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[MongoDB Notice]: Database disconnected.');
});

mongoose.connection.on('connected', () => {
  isConnected = true;
});

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('[MongoDB Warning] MONGO_URI is not defined.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      dbName: 'disaster_platform',
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.error(`[MongoDB Connection Error]: ${error.message}`);
  }
};

module.exports = connectDB;

