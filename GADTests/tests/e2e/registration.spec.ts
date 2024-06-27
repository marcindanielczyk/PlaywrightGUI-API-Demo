import { test, expect } from 'playwright/test';

test.describe('User registration to GAD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should register with valid credentials', async ({ page }) => {
    const registerUrl = 'http://localhost:3000/register.html';
    const loginUrl = 'http://localhost:3000/login/';
    const firstNameId = 'testName';
    const lastNameId = 'testLastName';
    const emailId = 'testEmail@testmail.com';
    const birthDateId = '2000-01-01';
    const passwordId = 'testPassword';

    await page.getByTestId('user-dropdown').hover();
    await page.locator('#registerBtn').click();
    expect(page.url()).toBe(registerUrl);
    await page.getByTestId('firstname-input').fill(firstNameId);
    await page.getByTestId('lastname-input').fill(lastNameId);
    await page.getByTestId('email-input').fill(emailId);
    await page.getByTestId('birthdate-input').fill(birthDateId);
    await page.click('body');
    await page.getByTestId('password-input').fill(passwordId);
    await page.locator('#avatar').nth(1).selectOption({ index: 1 });
    await page.locator('#registerButton').click();

    expect(page.url()).toBe(registerUrl);
    await page.waitForURL(loginUrl);
    expect(page.url()).toBe(loginUrl);
  });
});
