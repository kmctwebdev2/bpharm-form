import connectDB from './lib/mongodb';

declare const process: { env: { NEXT_RUNTIME?: string } };

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Next.js Server starting up...');

    try {
      await connectDB();
    } catch {
      console.log('MongoDB startup check skipped; requests will retry on demand.');
    }
  }
}
