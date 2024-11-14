import { expect, test } from "@playwright/test";

test("resend auth", async ({ page, browser }) => {
  await test.step("should send resend mail", async () => {
    await page.goto("http://localhost:3000/api/auth/signin");
    await page.getByPlaceholder("email@example").fill("test@runningfinder.de");
    await page.getByRole("button", { name: "Sign in with Resend" }).click();
    await expect(page).toHaveURL(
      /\/api\/auth\/verify-request\?provider=resend&type=email/,
    );

    const card = page.locator(".card");
    await expect(card).toBeVisible();
    await expect(card.locator("h1")).toHaveText("Check your email");
  });
});
