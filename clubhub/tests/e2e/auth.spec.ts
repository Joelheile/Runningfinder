import { test, expect, type Page } from "@playwright/test";

test("Basic auth", async ({ page, browser }) => {
  if (!process.env.NEXT_PUBLIC_TEST_PASSWORD) throw new TypeError("Missing TEST_PASSWORD");

  await test.step("should login", async () => {
    await page.goto("http://localhost:3000/api/auth/signin");
    await page.getByLabel("TestPassword").fill(process.env.NEXT_PUBLIC_TEST_PASSWORD!);
    await page.getByRole("button", { name: "Sign in with TestPassword" }).click();
    await page.waitForURL("http://localhost:3000");
    
    await page.waitForSelector('#session-info');
    
    const sessionInfo = await page.evaluate(() => {
      const element = document.getElementById('session-info');
      return element ? element.textContent : null;
    });

    const session = JSON.parse(sessionInfo || 'null');

    if (session) {
      expect(session).toEqual({
        user: {
          email: "bob@alice.com",
          name: "Bob Alice",
          image: "https://avatars.githubusercontent.com/u/67470890?s=200&v=4",
        },
        expires: expect.any(String),
      });
    } else {
      console.warn('Session is null or undefined');
    }
  });
});