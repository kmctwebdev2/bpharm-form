import { apiResponse } from '@/lib/api-response';
import connectDB from '@/lib/mongodb';
import { Counter } from '@/models/Counter';
import { Application } from '@/models/Application';

export async function GET() {
  try {
    await connectDB();

    // Explicitly initialize the models to ensure collections exist
    // when health check is called (helpful for initial setup verification)
    Counter.init();
    Application.init();

    return apiResponse.success({ database: 'connected' }, 'Health check passed');
  } catch (error) {
    return apiResponse.serverError(error, 'Database connection failed');
  }
}
