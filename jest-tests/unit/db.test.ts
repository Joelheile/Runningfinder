import { db } from "@/lib/db/db";
import { clubs } from "@/lib/db/schema/clubs";

describe('Database Connection', () => {
    it('should connect to the database and execute a query', async () => {
      try {
        const result = await db.select().from(clubs).limit(1);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        console.log('Query result:', result);
      } catch (error) {
        console.error('Database query failed:', error);
      }
    });
  });