import { expect, test } from '@playwright/test';



test('Test add club & run logic and delete both afterwards', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'All Clubs 🏃' }).click();
  await page.getByRole('button', { name: 'Add Club' }).click();
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="password"]', 'testpassword');
  await page.getByText("Sign in with Test Credentials").click();

  await page.getByLabel('Club Name').click();
  await page.getByLabel('Club Name').fill('ClubName');
  await page.getByLabel('Club Name').press('Tab');
  await page.getByLabel('Club Description').fill('ClubDescription');
  await page.getByLabel('Club Description').press('Tab');
  await page.getByLabel('Website URL (https://)').fill('https://clubwebsite.de');
  await page.getByLabel('Website URL (https://)').press('Tab');
  await page.getByLabel('Instagram Username').fill('ClubUsername');
  await page.getByRole('button', { name: 'Add Club' }).click();
  await expect(page.getByRole('link', { name: 'ClubName ClubName' })).toBeVisible();

  await page.getByRole('link', { name: 'ClubName ClubName' }).click();

  await page.getByRole('button', { name: 'Add first run 🏃‍♂️' }).click();
  await page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox').fill('FirstRun');
  await page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox').press('Tab');
  await page.locator('div').filter({ hasText: /^DifficultyEasyIntermediateAdvanced$/ }).getByRole('combobox').press('Tab');
  await page.locator('div').filter({ hasText: /^IntervalDailyWeeklyBiweeklyMonthly$/ }).getByRole('combobox').press('Tab');
  await page.locator('div').filter({ hasText: /^WeekdayMondayTuesdayWednesdayThursdayFridaySaturdaySunday$/ }).getByRole('combobox').press('Tab');
  await page.locator('input[type="time"]').press('Tab');
  await page.locator('input[type="time"]').fill('01:23');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('048');
  await page.getByText('NameDifficultyEasyIntermediateAdvancedIntervalDailyWeeklyBiweeklyMonthlyWeekdayM').click();
  await page.locator('div').filter({ hasText: /^Where are you starting\?$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Where are you starting\?$/ }).getByRole('textbox').fill('Starting Point');
  await page.getByRole('button', { name: 'Add run' }).click();
  await page.getByRole('button').first().click();
  await expect(page.getByText('FirstRun')).toBeVisible();
  await page.locator('div').filter({ hasText: /^FirstRun\|01:23\|48 km\|easy$/ }).getByRole('button').click();
  await expect(page.getByText('Successfully registered for')).toBeVisible();
  await page.locator('div').filter({ hasText: /^FirstRun\|01:23\|48 km\|easy$/ }).getByRole('button').click();
  await expect(page.getByText('Successfully deregistered')).toBeVisible();
  await page.locator('div').filter({ hasText: /^Starting Point$/ }).getByRole('button').nth(1).click();
  await expect(page.getByText('Run deleted successfully')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add first run 🏃‍♂️' })).toBeVisible();
  await page.getByRole('button').nth(2).click();
  await expect(page.locator('div').filter({ hasText: 'Club deleted successfully' }).nth(2)).toBeVisible();
})
