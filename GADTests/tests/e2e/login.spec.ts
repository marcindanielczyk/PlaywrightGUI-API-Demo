import { test, expect } from 'playwright/test';

test.describe('User login to GAD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('user-dropdown').hover();
    await page.locator('#loginBtn').click();
  });

  test('should log in with valid credentials', { tag: '@happyPath' }, async ({ page }) => {
    const userEmail = 'testEmail@testmail.com';
    const userPassword = 'testPassword';
    const expectedUrl = 'http://localhost:3000/welcome';

    await page.locator('#username').nth(1).fill(userEmail);
    await page.locator('#password').fill(userPassword);
    await page.locator('#loginButton').click();

    await page.waitForURL(expectedUrl);
    expect(page.url()).toBe(expectedUrl);
  });
});
