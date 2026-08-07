/* eslint-disable @typescript-eslint/no-unused-vars */
import { IApplication } from '@/types/application';
import { connectDB } from '@/lib/mongodb';
import { Application } from '@/models/Application';
import { Counter } from '@/models/Counter';

export class ApplicationService {
  /**
   * Generates a unique application number.
   * Format: KMCT-[YEAR]-[SEQUENCE]
   * Example: KMCT-2024-1001
   */
  static async generateApplicationNumber(): Promise<{
    applicationNumber: string;
    sequence: number;
  }> {
    throw new Error('Not implemented');
  }

  /**
   * Creates a new application in the database.
   * Also handles generating the application number atomically.
   */
  static async createApplication(applicationData: Partial<IApplication>): Promise<IApplication> {
    throw new Error('Not implemented');
  }

  /**
   * Retrieves an application by its application number.
   */
  static async getApplication(applicationNumber: string): Promise<IApplication | null> {
    throw new Error('Not implemented');
  }
}
