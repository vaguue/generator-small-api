import path from 'path';
import mongoose from 'mongoose';

const dev = (process.env.NODE_ENV || global.env) !== 'production';
const MONGODB_URI = global.__MONGO_URI__ || (dev ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() { //TODO reconnect, see (https://stackoverflow.com/questions/16226472/mongoose-autoreconnect-option)
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    })
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
