const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let mongodInstance = null;

// Ensure in-memory mongodb finds cached binary
const candidateDirs = [
  path.resolve(__dirname, '../../node_modules/.cache/mongodb-memory-server'),
  path.resolve(__dirname, '../../../node_modules/.cache/mongodb-memory-server'),
  '/home/diksha/.cache/mongodb-binaries',
];

for (const dir of candidateDirs) {
  if (fs.existsSync(dir)) {
    process.env.MONGOMS_DOWNLOAD_DIR = dir;
    break;
  }
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

  try {
    // Attempt standard connection with 3-second server selection timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to primary URI (${uri}): ${err.message}`);

    // If local connection failed, fall back to in-memory MongoDB for smooth developer experience
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[MongoDB] Starting in-memory MongoDB server fallback...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const memUri = mongodInstance.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`[MongoDB] In-memory database started and connected at: ${memUri}`);
        return conn;
      } catch (memErr) {
        console.error('[MongoDB] In-memory fallback failed:', memErr.message);
        throw memErr;
      }
    } else {
      throw err;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
