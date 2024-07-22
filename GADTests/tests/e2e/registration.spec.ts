import { test, expect } from 'playwright/test';
import { v4 as UUID4 } from 'uuid';
import { deleteUserIfExists } from '../../helpers/users/deleteUserIfExists';
import { createDefaultUser } from '../../helpers/users/createDefaultUser';

test.describe('User registration to GAD', () => {
  const firstNameId = 'testName';
  const lastNameId = 'testLastName';
  const emailId = 'testEmail@testmail.com';
  const birthDateId = '2000-01-01';
  const passwordId = 'testPassword';

  test.beforeAll(async ({ request }) => {
    const restoreDB = await request.get('/api/restoreDB');

    expect(restoreDB.ok()).toBeTruthy();
  });

  test.beforeEach(async ({ page }) => {
    const registerUrl = 'http://localhost:3000/register.html';

    await page.goto('/');
    await page.getByTestId('user-dropdown').hover();
    await page.locator('#registerBtn').click();

    expect(page.url()).toBe(registerUrl);
  });

  test(
    'user should register with valid credentials',
    {
      tag: '@happyPath',
      annotation: { type: 'link', description: 'https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page, request }) => {
      const email = `test-${UUID4()}@example.com`;
      await deleteUserIfExists(request, email);
      const loginUrl = 'http://localhost:3000/login/';

      await page.getByTestId('firstname-input').fill(firstNameId);
      await page.getByTestId('lastname-input').fill(lastNameId);
      await page.getByTestId('email-input').fill(email);
      await page.getByTestId('birthdate-input').fill(birthDateId);
      await page.click('body');
      await page.getByTestId('password-input').fill(passwordId);
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      await page.waitForURL(loginUrl);
      expect(page.url()).toBe(loginUrl);

      await deleteUserIfExists(request, email);
    },
  );

  test(
    'user should not register with email not unique',
    {
      tag: '@unhappyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page, request }) => {
      const email = `test-${UUID4()}@example.com`;
      await createDefaultUser(request, email);

      const alertPopupId = page.getByTestId('alert-popup');

      await page.getByTestId('firstname-input').fill(firstNameId);
      await page.getByTestId('lastname-input').fill(lastNameId);
      await page.getByTestId('email-input').fill(email);
      await page.getByTestId('birthdate-input').fill(birthDateId);
      await page.click('body');
      await page.getByTestId('password-input').fill(passwordId);
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      await expect(alertPopupId).toHaveText('User not created! Email not unique');

      await deleteUserIfExists(request, email);
    },
  );

  test(
    'user should not register without email',
    {
      tag: ['@unhappyPath', '@flaky'],
      annotation: { type: 'info', description: 'flaky when run with 2 workers, because of beforeAll restoreDB race condition' },
    },
    async ({ page }) => {
      const emailValidatorInfoId = page.locator('#octavalidate_email');

      await page.getByTestId('firstname-input').fill(firstNameId);
      await page.getByTestId('lastname-input').fill(lastNameId);
      await page.getByTestId('birthdate-input').fill(birthDateId);
      await page.click('body');
      await page.getByTestId('password-input').fill(passwordId);
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      await expect(emailValidatorInfoId).toHaveText('This field is required');
    },
  );

  test(
    'user should not register without first name',
    {
      tag: '@unhappyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page }) => {
      const firstNameValidatorInfoId = page.locator('#octavalidate_firstname');

      await page.getByTestId('lastname-input').fill(lastNameId);
      await page.getByTestId('email-input').fill(emailId);
      await page.getByTestId('birthdate-input').fill(birthDateId);
      await page.click('body');
      await page.getByTestId('password-input').fill(passwordId);
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      await expect(firstNameValidatorInfoId).toHaveText('This field is required');
    },
  );

  test(
    'user should not register without last name',
    {
      tag: '@unhappyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page }) => {
      const lastNameValidatorInfoId = page.locator('#octavalidate_lastname');

      await page.getByTestId('firstname-input').fill(firstNameId);
      await page.getByTestId('email-input').fill(emailId);
      await page.getByTestId('birthdate-input').fill(birthDateId);
      await page.click('body');
      await page.getByTestId('password-input').fill(passwordId);
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      expect(lastNameValidatorInfoId).toHaveText('This field is required');
    },
  );

  test(
    'user should not register without password',
    {
      tag: '@unhappyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page }) => {
      const passwordValidatorInfoId = page.locator('#octavalidate_password');

      await page.getByTestId('firstname-input').fill(firstNameId);
      await page.getByTestId('lastname-input').fill(lastNameId);
      await page.getByTestId('email-input').fill(emailId);
      await page.getByTestId('birthdate-input').fill(birthDateId);
      await page.click('body');
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      expect(passwordValidatorInfoId).toHaveText('This field is required');
    },
  );
});
