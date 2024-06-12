import { Injectable, Logger } from '@nestjs/common';
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  private sql = postgres({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: 'require',
  });

  async insertData(jsonData: any) {
    try {
      const result = await this.sql`
            INSERT INTO feedback (data)
            VALUES (${this.sql.json(jsonData)})
            RETURNING id, created_at
          `;
      this.logger.debug('Data inserted:', result);
    } catch (error) {
      this.logger.error('Error inserting data:', error);
    }
  }
}
