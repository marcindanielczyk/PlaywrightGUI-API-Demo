import { test, expect } from 'playwright/test';

test.describe('User registration to GAD', () => {
  const registerUrl = 'http://localhost:3000/register.html';
  const loginUrl = 'http://localhost:3000/login/';

  test.beforeAll(async ({ request }) => {
    const restoreDB = await request.get('/api/restoreDB');
    expect(restoreDB.ok()).toBeTruthy();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('user-dropdown').hover();
    await page.locator('#registerBtn').click();
    expect(page.url()).toBe(registerUrl);
  });

  test('should register with valid credentials', { tag: '@happyPath' }, async ({ page }) => {
    const firstNameId = 'testName';
    const lastNameId = 'testLastName';
    const emailId = 'testEmail@testmail.com';
    const birthDateId = '2000-01-01';
    const passwordId = 'testPassword';

    await page.getByTestId('firstname-input').fill(firstNameId);
    await page.getByTestId('lastname-input').fill(lastNameId);
    await page.getByTestId('email-input').fill(emailId);
    await page.getByTestId('birthdate-input').fill(birthDateId);
    await page.click('body');
    await page.getByTestId('password-input').fill(passwordId);
    await page.locator('#avatar').nth(1).selectOption({ index: 1 });
    await page.locator('#registerButton').click();

    await page.waitForURL(loginUrl);
    expect(page.url()).toBe(loginUrl);
  });

  test('should not register with email not unique', { tag: '@unhappyPath' }, async ({ page }) => {
    const firstNameId = 'testName';
    const lastNameId = 'testLastName';
    const emailId = 'testEmail@testmail.com';
    const birthDateId = '2000-01-01';
    const passwordId = 'testPassword';

    await page.getByTestId('firstname-input').fill(firstNameId);
    await page.getByTestId('lastname-input').fill(lastNameId);
    await page.getByTestId('email-input').fill(emailId);
    await page.getByTestId('birthdate-input').fill(birthDateId);
    await page.click('body');
    await page.getByTestId('password-input').fill(passwordId);
    await page.locator('#avatar').nth(1).selectOption({ index: 1 });
    await page.locator('#registerButton').click();

    await expect(page.getByTestId('alert-popup')).toHaveText('User not created! Email not unique');
  });

  // test('should not register without email', { tag: '@unhappyPath' }, async ({ page }) => {});

  // test('should not register without firstname', { tag: '@unhappyPath' }, async ({ page }) => {});

  // test('should not register without lastname', { tag: '@unhappyPath' }, async ({ page }) => {});

  // test('should not register without password', { tag: '@unhappyPath' }, async ({ page }) => {});
});
