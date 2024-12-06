import { expect, test } from "@playwright/test";

test("Test magiclink auth using Resend", async ({ page, browser }) => {
  await page.goto("http://localhost:3000/api/auth/signin");
  await page.getByLabel("email").fill("joels.tests@gmail.com");
  await page.getByRole("button", { name: "Sign in with Resend" }).click();
  await expect(page.getByText("A sign in link has been sent")).toBeVisible();
  await page.goto(
    "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=AcMMx-fIOSUWezchQOnuBUHBv32L68tNFbZUXhH5_X-AfQeoBUXlU9yNDNxYwKylwwlqI1G4gKrr&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-567488756%3A1733311372119368&ddm=1",
  );

  await page.getByLabel("Email or phone").fill("joels.tests@gmail.com");
  await page.getByLabel("Email or phone").press("Enter");
  await page
    .getByLabel("Enter your password")
    .fill(process.env.NEXT_PUBLIC_GMAIL_TEST_PASSWORD as string);
  await page.getByRole("button", { name: "Next" }).click();
  await page
    .getByRole("row", { name: /no-reply.*Ready for Your Next Run?/ })
    .click();


    const showTrimmedContent = await page.locator('div[role="button"][data-tooltip="Show trimmed content"]');

      await showTrimmedContent.click();

    page.getByRole("link", { name: "Let's Go" }).click();
  const newPage = await page.waitForEvent("popup");
  await page.waitForLoadState();
  await expect(newPage).toHaveURL("http://localhost:3000/");
  await expect(newPage.getByText("All Clubs 🏃")).toBeVisible();
});
