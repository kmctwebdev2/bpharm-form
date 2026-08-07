export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Next.js Server starting up...');
    try {
      const { connectDB } = await import('./lib/mongodb');
      await connectDB();
    } catch (error) {
      console.error('Failed to initialize MongoDB during server startup:', error);
    }
  }
}
