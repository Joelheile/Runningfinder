import { db } from "@/lib/db/db";
import { clubs } from "@/lib/db/schema";

describe("Club Database Operations", () => {
  it("should fetch clubs from the database", async () => {
    try {
        const result = await db.select().from(clubs).limit(1);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      // Log clubs for debugging
      if (result.length > 0) {
        console.log("Available clubs:", result.map((club: any) => ({
          id: club.id,
          name: club.name,
          slug: club.slug
        })));
      } else {
        console.log("No clubs found in the database");
      }
    } catch (error) {
      console.error("Database query failed:", error);
      throw error;
    }
  });
}); 