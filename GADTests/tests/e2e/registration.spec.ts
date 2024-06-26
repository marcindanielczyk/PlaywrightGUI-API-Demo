import { test, expect } from 'playwright/test';

test.describe('User registration to GAD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should register with valid credentials', async ({ page }) => {
    await page.getByTestId('user-dropdown').hover();
    await page.locator('#registerBtn').click();
    expect(page.url()).toBe('http://localhost:3000/register.html');
    await page.getByTestId('firstname-input').fill('testName');
    await page.getByTestId('lastname-input').fill('testLastName');
    await page.getByTestId('email-input').fill('testEmail@testmail.com');
    await page.getByTestId('birthdate-input').fill('2000-01-01');
    await page.click('body');
    await page.getByTestId('password-input').fill('testPassword');
    await page.locator('#avatar').nth(1).selectOption({ index: 1 });
    await page.locator('#registerButton').click();

    expect(page.url()).toBe('http://localhost:3000/register.html');
    await page.waitForURL('http://localhost:3000/login/');
    expect(page.url()).toBe('http://localhost:3000/login/');
  });
});
