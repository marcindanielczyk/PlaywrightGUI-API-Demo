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

  test(
    'should register with valid credentials',
    {
      tag: '@happyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page }) => {
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
    },
  );

  test(
    'should not register with email not unique',
    {
      tag: '@unhappyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page }) => {
      const firstNameId = 'testName';
      const lastNameId = 'testLastName';
      const emailId = 'testEmail@testmail.com';
      const birthDateId = '2000-01-01';
      const passwordId = 'testPassword';
      const alertPopupId = page.getByTestId('alert-popup');

      await page.getByTestId('firstname-input').fill(firstNameId);
      await page.getByTestId('lastname-input').fill(lastNameId);
      await page.getByTestId('email-input').fill(emailId);
      await page.getByTestId('birthdate-input').fill(birthDateId);
      await page.click('body');
      await page.getByTestId('password-input').fill(passwordId);
      await page.locator('#avatar').nth(1).selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      await expect(alertPopupId).toHaveText('User not created! Email not unique');
    },
  );

  test(
    'should not register without email',
    {
      tag: '@unhappyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page }) => {
      const firstNameId = 'testName';
      const lastNameId = 'testLastName';
      const birthDateId = '2000-01-01';
      const passwordId = 'testPassword';
      const emailValidatorInfoId = page.locator('#octavalidate_email');

      await page.getByTestId('firstname-input').fill(firstNameId);
      await page.getByTestId('lastname-input').fill(lastNameId);
      await page.getByTestId('birthdate-input').fill(birthDateId);
      await page.click('body');
      await page.getByTestId('password-input').fill(passwordId);
      await page.locator('#avatar').nth(1).selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      await expect(emailValidatorInfoId).toHaveText('This field is required');
    },
  );

  test(
    'should not register without first name',
    {
      tag: '@unhappyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page }) => {
      const lastNameId = 'testLastName';
      const emailId = 'testEmail@testmail.com';
      const birthDateId = '2000-01-01';
      const passwordId = 'testPassword';
      const firstNameValidatorInfoId = page.locator('#octavalidate_firstname');

      await page.getByTestId('lastname-input').fill(lastNameId);
      await page.getByTestId('email-input').fill(emailId);
      await page.getByTestId('birthdate-input').fill(birthDateId);
      await page.click('body');
      await page.getByTestId('password-input').fill(passwordId);
      await page.locator('#avatar').nth(1).selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      await expect(firstNameValidatorInfoId).toHaveText('This field is required');
    },
  );

  // test('should not register without last name', { tag: '@unhappyPath' }, async ({ page }) => {});

  // test('should not register without password', { tag: '@unhappyPath' }, async ({ page }) => {});
});
