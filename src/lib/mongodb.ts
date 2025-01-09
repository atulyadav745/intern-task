// import mongoose from 'mongoose';

// // Extend the NodeJS.Global interface to include the `mongoose` property
// declare global {
//   namespace NodeJS {
//     interface Global {
//       mongoose: {
//         conn: typeof mongoose | null;
//         promise: Promise<typeof mongoose> | null;
//       };
//     }
//   }
// }

// // Check if MONGODB_URI is defined in environment variables
// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your MongoDB URI to .env.local');
// }

// const MONGODB_URI = process.env.MONGODB_URI;

// // Define a cached global variable to store the MongoDB connection
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export async function connectToDatabase() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {});
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// Importing mongoose library along with Connection type from it
import mongoose, { Connection } from "mongoose";

// Declaring a variable to store the cached database connection
let cachedConnection: Connection | null = null;

// Function to establish a connection to MongoDB
export async function connectToMongoDB() {
  // If a cached connection exists, return it
  if (cachedConnection) {
    console.log("Using cached db connection");
    return cachedConnection;
  }
  try {
    // If no cached connection exists, establish a new connection to MongoDB
    const cnx = await mongoose.connect(process.env.MONGODB_URI!);
    // Cache the connection for future use
    cachedConnection = cnx.connection;
    // Log message indicating a new MongoDB connection is established
    console.log("New mongodb connection established");
    // Return the newly established connection
    return cachedConnection;
  } catch (error) {
    // If an error occurs during connection, log the error and throw it
    console.log(error);
    throw error;
  }
}