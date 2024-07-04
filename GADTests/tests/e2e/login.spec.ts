import { test, expect } from 'playwright/test';

test.describe('User login to GAD', () => {
  const firstNameId = 'testName';
  const lastNameId = 'testLastName';
  const emailId = 'test@testmail.com';
  const birthDateId = '2000-01-01';
  const passwordId = 'testPassword';
  const avatarId = '.\\data\\users\\16709f41-acf3-4738-b4f8-0616a6b6e7ae.jpg';

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('user-dropdown').hover();
    await page.locator('#loginBtn').click();
  });

  test.beforeAll(async ({ request }) => {
    const restoreDB = await request.get('/api/restoreDB');

    expect(restoreDB.ok()).toBeTruthy();

    const createNewUser = await request.post('api/users', {
      data: {
        firstname: firstNameId,
        lastname: lastNameId,
        email: emailId,
        password: passwordId,
        avatar: avatarId,
      },
    });
    expect(createNewUser.ok()).toBeTruthy();
  });

  test('user should log in with valid credentials', { tag: ['@happyPath', '@databaseDependent'] }, async ({ page, request }) => {
    const welcomeUrl = 'http://localhost:3000/welcome';

    await page.locator('input#username').fill(emailId);
    await page.locator('#password').fill(passwordId);
    await page.locator('#loginButton').click();

    await page.waitForURL(welcomeUrl);
    expect(page.url()).toBe(welcomeUrl);
  });

  test('user should not log in if does not exist', { tag: '@unhappyPath' }, async ({ page, request }) => {
    const checkIfUserDoesExist = await request.get(`api/users?email=${emailId}`);
    const body = await checkIfUserDoesExist.json();
    console.log(body);

    if (body.length > 0) {
      const loginToGetAccessToken = await request.post('api/login', {
        data: {
          email: emailId,
          password: passwordId,
        },
      });
      expect(loginToGetAccessToken.ok()).toBeTruthy();

      const accessTokenBody = await loginToGetAccessToken.json();
      const accessToken = accessTokenBody.access_token;

      const userId = body[0].id;
      const deleteUser = await request.delete(`api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(deleteUser.ok()).toBeTruthy();
    }

    await page.locator('input#username').fill(emailId);
    await page.locator('#password').fill(passwordId);
    await page.locator('#loginButton').click();

    const loginErrorMessage = await page.getByTestId('login-error').innerText();
    expect(loginErrorMessage).toBe('Invalid username or password');
  });
});
