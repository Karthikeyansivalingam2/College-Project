const mongoose = require('mongoose');

// Cache the connection across serverless invocations (Vercel cold-start fix)
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            serverSelectionTimeoutMS: 10000,   // 10s to find a server
            socketTimeoutMS: 45000,            // 45s socket timeout
            connectTimeoutMS: 10000,           // 10s initial connection
            maxPoolSize: 5,                    // Keep pool small for serverless
            bufferCommands: false,             // Fail fast if not connected
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
            .then((mongooseInstance) => {
                console.log("✅ Connected to MongoDB Atlas");
                return mongooseInstance;
            })
            .catch((err) => {
                cached.promise = null; // Reset so next request retries
                console.error("❌ MongoDB Connection Error:", err.message);
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
};

module.exports = connectDB;
