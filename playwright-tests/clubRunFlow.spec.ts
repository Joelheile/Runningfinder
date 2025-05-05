import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

test("Test add club & run logic and delete both afterwards", async ({
  page,
}) => {
  const clubName = `${faker.company.name()} Club (test)`;
  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "Search Clubs 🏃" }).click();
  await page.getByRole("button", { name: "Add Club" }).click();
  await page.getByRole("textbox", { name: "Club Name" }).fill(clubName);
  await page.getByRole("textbox", { name: "Club Description" }).click();
  await page
    .getByRole("textbox", { name: "Club Description" })
    .fill("Club Description");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("textbox", { name: "Instagram Username" }).click();
  await page.getByRole("textbox", { name: "Instagram Username" }).fill("test");
  await page.getByRole("textbox", { name: "Strava Club Username" }).click();
  await page
    .getByRole("textbox", { name: "Strava Club Username" })
    .fill("test");
  await page.getByRole("button", { name: "Create Club" }).click();
  await expect(page.getByText("Club added successfully 🎉 It")).toBeVisible();
});
