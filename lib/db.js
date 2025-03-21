import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env");
}

try {
  if (!global._mongoClientPromise) {
    console.time("MongoDB Connection");
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
    console.timeEnd("MongoDB Connection");
  }
  clientPromise = global._mongoClientPromise;
} catch (error) {
  console.error("Failed to connect to MongoDB:", error.message);
  throw new Error("Failed to initialize MongoDB client");
}

export default clientPromise;