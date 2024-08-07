import { test, expect } from 'playwright/test';
import { v4 as UUID4 } from 'uuid';
import { deleteUserIfExists } from '../../helpers/users/deleteUserIfExists.helpers';
import { createUser } from '../../helpers/users/createUser.helpers';

test.describe('User registration in GAD', () => {
  const testFirstName = 'TestFirstName';
  const testLastName = 'TestLastName';
  const testBirthDate = '2000-01-01';
  const testPassword = 'testPassword';

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
      const testUserEmail = `test-${UUID4()}@example.com`;
      await deleteUserIfExists(request, testUserEmail);
      const loginUrl = 'http://localhost:3000/login/';

      await page.getByTestId('firstname-input').fill(testFirstName);
      await page.getByTestId('lastname-input').fill(testLastName);
      await page.getByTestId('email-input').fill(testUserEmail);
      await page.getByTestId('birthdate-input').fill(testBirthDate);
      await page.click('body');
      await page.getByTestId('password-input').fill(testPassword);
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      await page.waitForURL(loginUrl);
      expect(page.url()).toBe(loginUrl);

      await deleteUserIfExists(request, testUserEmail);
    },
  );

  test(
    'user should not register with email not unique',
    {
      tag: '@unhappyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page, request }) => {
      const testUserEmail = `test-${UUID4()}@example.com`;
      await createUser(request, testUserEmail);

      const alertPopup = page.getByTestId('alert-popup');

      await page.getByTestId('firstname-input').fill(testFirstName);
      await page.getByTestId('lastname-input').fill(testLastName);
      await page.getByTestId('email-input').fill(testUserEmail);
      await page.getByTestId('birthdate-input').fill(testBirthDate);
      await page.click('body');
      await page.getByTestId('password-input').fill(testPassword);
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      await expect(alertPopup).toHaveText('User not created! Email not unique');

      await deleteUserIfExists(request, testUserEmail);
    },
  );

  test(
    'user should not register without email',
    {
      tag: ['@unhappyPath', '@flaky'],
      annotation: { type: 'info', description: 'flaky when run with 2 workers, because of beforeAll restoreDB race condition' },
    },
    async ({ page }) => {
      const emailValidatorInfo = page.locator('#octavalidate_email');

      await page.getByTestId('firstname-input').fill(testFirstName);
      await page.getByTestId('lastname-input').fill(testLastName);
      await page.getByTestId('birthdate-input').fill(testBirthDate);
      await page.click('body');
      await page.getByTestId('password-input').fill(testPassword);
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      await expect(emailValidatorInfo).toHaveText('This field is required');
    },
  );

  test(
    'user should not register without first name',
    {
      tag: '@unhappyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page }) => {
      const firstNameValidatorInfo = page.locator('#octavalidate_firstname');
      const testUserEmail = `test-${UUID4()}@example.com`;

      await page.getByTestId('lastname-input').fill(testLastName);
      await page.getByTestId('email-input').fill(testUserEmail);
      await page.getByTestId('birthdate-input').fill(testBirthDate);
      await page.click('body');
      await page.getByTestId('password-input').fill(testPassword);
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      await expect(firstNameValidatorInfo).toHaveText('This field is required');
    },
  );

  test(
    'user should not register without last name',
    {
      tag: '@unhappyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page }) => {
      const lastNameValidatorInfo = page.locator('#octavalidate_lastname');
      const testUserEmail = `test-${UUID4()}@example.com`;

      await page.getByTestId('firstname-input').fill(testFirstName);
      await page.getByTestId('email-input').fill(testUserEmail);
      await page.getByTestId('birthdate-input').fill(testBirthDate);
      await page.click('body');
      await page.getByTestId('password-input').fill(testPassword);
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      expect(lastNameValidatorInfo).toHaveText('This field is required');
    },
  );

  test(
    'user should not register without password',
    {
      tag: '@unhappyPath',
      annotation: { type: 'link', description: 'info about tested application -> https://jaktestowac.pl/about-gad/#Main_features' },
    },
    async ({ page }) => {
      const passwordValidatorInfo = page.locator('#octavalidate_password');
      const testUserEmail = `test-${UUID4()}@example.com`;

      await page.getByTestId('firstname-input').fill(testFirstName);
      await page.getByTestId('lastname-input').fill(testLastName);
      await page.getByTestId('email-input').fill(testUserEmail);
      await page.getByTestId('birthdate-input').fill(testBirthDate);
      await page.click('body');
      await page.locator('select#avatar').selectOption({ index: 1 });
      await page.locator('#registerButton').click();

      expect(passwordValidatorInfo).toHaveText('This field is required');
    },
  );
});