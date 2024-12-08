import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { v4 as uuidv4, v4 } from "uuid";
import { avatars, users } from "./schema/users";
import { runs } from "./schema/runs";
import { clubs } from "./schema/clubs";
import { faker } from "@faker-js/faker";
import { seed } from "drizzle-seed";
import { config } from "dotenv";
config({ path: ".env.local" });

const databaseUrl = process.env.NEXT_PUBLIC_DB_DEV

console.log("Database URL:", databaseUrl);

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: false,
  });
  const db = drizzle(pool);

async function main() {

    console.log("cleaning up started");
    await db.delete(runs).execute();
    await db.delete(clubs).execute();
    await db.delete(avatars).execute();
    console.log("cleaning up completed");

  console.log("Seeding started!");

  for (let i = 0; i < 50; i++) {
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
      locationLng: clubCoordinates[1].toString(),
      locationLat: clubCoordinates[0].toString(),
      instagramUsername: faker.internet.displayName(),
      stravaUsername: faker.internet.displayName(),
      websiteUrl: faker.internet.url(),
      avatarFileId: avatarFileId,
      creationDate: new Date(),
      memberCount: faker.number.int({ min: 1, max: 1000 }),
    });

    console.log("Club seeded 🚀", clubId);

    for(let j = 0; j < 5; j++) {
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
      date: runDate,
      interval: faker.helpers.arrayElement([
        "once",
        "daily",
        "weekly",
        "monthly",
      ]),
      intervalDay: faker.number.int({ min: 1, max: 7 }),
      startDescription: faker.location.street(),
      startTime: faker.date.future().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      locationLng: runCoordinates[1].toString(),
      locationLat: runCoordinates[0].toString(),
      distance: faker.number.float({ min: 1, max: 42 }).toString(),
    });
    console.log("Run seeded 🏃", runId);
  }}

  console.log("Seeding completed!");
}

main();
