import mongoose from 'mongoose';

let connecting = null;

// Connects the shared mongoose connection once per warm instance. Checks the live
// readyState, and concurrent callers share one in-flight connect.
export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  connecting ??= mongoose
    .connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .finally(() => { connecting = null; });
  await connecting;
}
