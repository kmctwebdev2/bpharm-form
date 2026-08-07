import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

export async function connectDB() {
  // If we are already connected or connecting, return early
  if (mongoose.connection.readyState >= 1) {
    console.log('MongoDB is already connected or connecting.');
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
      family: 4, // Force IPv4 to bypass local DNS/IPv6 SRV resolution issues
    });
    console.log('✅ Successfully connected to MongoDB.');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Global connection event listeners for proper logging
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected');
});

// Auto-connect when this module is imported (e.g. on server startup)
connectDB().catch((err) => {
  console.error('Failed to auto-connect to MongoDB:', err);
});
