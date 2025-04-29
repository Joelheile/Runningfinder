import { faker } from "@faker-js/faker";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { avatars, clubs, runs } from "./schema";

config({ path: ".env.local" });

const databaseUrl = process.env.DB_DEV;

console.log("Database URL:", databaseUrl);

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: false,
});
const db = drizzle(pool);

async function main() {
  console.log("Cleaning up started");
  try {
    await db.delete(runs).execute();
    await db.delete(clubs).execute();
    await db.delete(avatars).execute();
    console.log("Cleaning up completed");

    console.log("Seeding started!");

    for (let i = 0; i < 500; i++) {
      const clubId = uuidv4();
      const clubCoordinates = faker.location.nearbyGPSCoordinate({
        origin: [52.52, 13.405],
        radius: 10,
        isMetric: true,
      });
      const avatarFileId = uuidv4();

      await db.insert(avatars).values({
        id: avatarFileId,
        name: faker.internet.displayName(),
        img_url: faker.image.avatar(),
        uploadDate: new Date(),
        type: "club",
      });

      await db.insert(clubs).values({
        id: clubId,
        name: faker.company.name(),
        slug: faker.lorem.slug(),
        description: faker.lorem.sentence(3),
        instagramUsername: faker.internet.displayName(),
        stravaUsername: faker.internet.displayName(),
        websiteUrl: faker.internet.url(),
        avatarUrl: faker.image.avatar(),
        creationDate: new Date(),
        isApproved: faker.datatype.boolean(),
      });

      console.log("Club seeded 🚀", clubId);

      for (let j = 0; j < 5; j++) {
        const runId = uuidv4();
        const runDate = faker.date.future();
        const runCoordinates = faker.location.nearbyGPSCoordinate({
          origin: [52.52, 13.405],
          radius: 10,
          isMetric: true,
        });

        await db.insert(runs).values({
          id: runId,
          name: faker.person.jobArea() + " Run",
          difficulty: faker.helpers.arrayElement([
            "easy",
            "intermediate",
            "advanced",
          ]),
          clubId: clubId,
          datetime: runDate,
          weekday: runDate.getDay(),
          startDescription: faker.location.street(),
          locationLng: runCoordinates[1].toString(),
          locationLat: runCoordinates[0].toString(),
          mapsLink: null,
          distance: faker.number.int({ min: 1, max: 42 }).toString(),
          isRecurrent: faker.datatype.boolean(),
          isApproved: faker.datatype.boolean(),
        });

        console.log("Run seeded 🏃", runId);
      }
    }

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

main();
