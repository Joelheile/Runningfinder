import { db } from "@/lib/db/db";
import { clubs } from "@/lib/db/schema";

describe("Club Database Operations", () => {
  it("should fetch clubs from the database", async () => {
    try {
      const result = await db.select().from(clubs).execute();
      const limitedResults = result.slice(0, 1);
      
      expect(limitedResults).toBeDefined();
      expect(Array.isArray(limitedResults)).toBe(true);

      // Log clubs for debugging
      if (limitedResults.length > 0) {
        console.log(
          "Available clubs:",
          limitedResults.map((club: any) => ({
            id: club.id,
            name: club.name,
            slug: club.slug,
          })),
        );
      } else {
        console.log("No clubs found in the database");
      }
    } catch (error) {
      console.error("Database query failed:", error);
      throw error;
    }
  });
});
