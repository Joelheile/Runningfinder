import { expect, test } from '@playwright/test';
test('Test homescreen to create Club page using oauth', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'All Clubs 🏃' }).click();
  await expect(page.getByRole('heading', { name: 'Ready for your next run?' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Club' }).click();
  await page.getByRole('button', { name: 'Sign in with GitHub' }).click();
  await page.getByLabel('Username or email address').click();
  await page.getByLabel('Username or email address').fill('joelheile');
  await page.getByLabel('Username or email address').press('Tab');
  await page.getByLabel('Username or email address').click();
  await page.getByLabel('Username or email address').press('ControlOrMeta+a');
  await page.getByLabel('Username or email address').fill('joels-test');
  await page.getByLabel('Username or email address').press('Tab');
  const password = process.env.NEXT_PUBLIC_GITHUB_TEST_PASSWORD as string;
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Add Club' })).toBeVisible();
});