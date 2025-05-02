import { expect, test } from "@playwright/test";

test("Test magiclink auth using Resend", async ({ page, browser }) => {
  await page.goto("http://localhost:3000/api/auth/signin");
  await page
    .getByRole("textbox", { name: "email" })
    .fill("joels.tests@gmail.com");
  await page.getByRole("button", { name: "Sign in with Resend" }).click();
  await expect(
    page.getByRole("heading", { name: "Check your email" }),
  ).toBeVisible();
  await page.goto(
    "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=AcMMx-fIOSUWezchQOnuBUHBv32L68tNFbZUXhH5_X-AfQeoBUXlU9yNDNxYwKylwwlqI1G4gKrr&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-567488756%3A1733311372119368&ddm=1",
  );

  await page.getByLabel("Email or phone").fill("joels.tests@gmail.com");
  await page.getByLabel("Email or phone").press("Enter");
  await page.getByLabel("Enter your password").fill("ywefIYH*q!mCw9");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("row", { name: "Ready for your Next Run?" }).click();
  await page.waitForLoadState();
  await page.getByRole("link", { name: "Let's Go" }).click();
  await page.waitForLoadState();
  const [newPage] = await Promise.all([page.waitForEvent("popup")]);
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL("http://localhost:3000/");
  await page.goto("https://mail.google.com/mail/u/0/#inbox");
  await page.getByRole("row", { name: "Ready for your Next Run?" }).click();
  await page.waitForLoadState();
  await page.getByRole("button", { name: "Delete" }).click();
});
