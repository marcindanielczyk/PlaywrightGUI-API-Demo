import { test, expect } from 'playwright/test';

test.describe('User login to GAD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should log in with valid credentials', async ({ page }) => {
    await page.getByTestId('user-dropdown').hover();
    await page.locator('#loginBtn').click();
    await page.locator('#username').nth(1).fill('testEmail@testmail.com');
    await page.locator('#password').fill('testPassword');
    await page.locator('#loginButton').click();

    await page.waitForURL('http://localhost:3000/welcome');
    expect(page.url()).toBe('http://localhost:3000/welcome');
  });
});
