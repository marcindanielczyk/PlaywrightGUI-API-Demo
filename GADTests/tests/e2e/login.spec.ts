import { test, expect } from 'playwright/test';
import { v4 as UUID4 } from 'uuid';
import { createUser } from '../../helpers/users/createUser.helpers';
import { deleteUserIfExists } from '../../helpers/users/deleteUserIfExists.helpers';

test.describe('User authentication in GAD', () => {
  const testPassword = 'testPassword';

  test.beforeAll(async ({ request }) => {
    const restoreDB = await request.get('/api/restoreDB');
    expect(restoreDB.ok()).toBeTruthy();
  });

  test.beforeEach(async ({ page }) => {
    const loginUrl = 'http://localhost:3000/login/';

    await page.goto('/');
    await page.getByTestId('user-dropdown').hover();
    await page.locator('#loginBtn').click();

    expect(page.url()).toBe(loginUrl);
  });

  test('user should log in with valid credentials', { tag: '@happyPath' }, async ({ page, request }) => {
    const testUserEmail = `test-${UUID4()}@example.com`;
    await createUser(request, testUserEmail);

    const welcomeUrl = 'http://localhost:3000/welcome';

    await page.locator('input#username').fill(testUserEmail);
    await page.locator('#password').fill(testPassword);
    await page.locator('#loginButton').click();

    await page.waitForURL(welcomeUrl);
    expect(page.url()).toBe(welcomeUrl);

    await deleteUserIfExists(request, testUserEmail);
  });

  test('user should not log in if does not exist', { tag: '@unhappyPath' }, async ({ page, request }) => {
    const testUserEmail = `test-${UUID4()}@example.com`;
    await deleteUserIfExists(request, testUserEmail);

    await page.locator('input#username').fill(testUserEmail);
    await page.locator('#password').fill(testPassword);
    await page.locator('#loginButton').click();

    const loginErrorMessage = await page.getByTestId('login-error').innerText();
    expect(loginErrorMessage).toBe('Invalid username or password');
  });

  test('user should not log in without email provided', { tag: '@unhappyPath' }, async ({ page, request }) => {
    const testUserEmail = `test-${UUID4()}@example.com`;
    await createUser(request, testUserEmail);

    await page.locator('#password').fill(testPassword);
    await page.locator('#loginButton').click();

    const loginErrorMessage = await page.getByTestId('login-error').innerText();
    expect(loginErrorMessage).toBe('Invalid username or password');

    await deleteUserIfExists(request, testUserEmail);
  });

  test('user should not log in without password provided', { tag: '@unhappyPath' }, async ({ page, request }) => {
    const testUserEmail = `test-${UUID4()}@example.com`;
    await createUser(request, testUserEmail);

    await page.locator('input#username').fill(testUserEmail);
    await page.locator('#loginButton').click();

    const loginErrorMessage = await page.getByTestId('login-error').innerText();
    expect(loginErrorMessage).toBe('Invalid username or password');

    await deleteUserIfExists(request, testUserEmail);
  });
});
