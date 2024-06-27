import { test, expect } from 'playwright/test';

test.describe('User login to GAD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should log in with valid credentials', async ({ page }) => {
    const userId = 'testEmail@testmail.com';
    const userPassword = 'testPassword';
    const expectedUrl = 'http://localhost:3000/welcome';

    await page.getByTestId('user-dropdown').hover();
    await page.locator('#loginBtn').click();
    await page.locator('#username').nth(1).fill(userId);
    await page.locator('#password').fill(userPassword);
    await page.locator('#loginButton').click();

    await page.waitForURL(expectedUrl);
    await expect(page.url()).toBe(expectedUrl);
  });
});
