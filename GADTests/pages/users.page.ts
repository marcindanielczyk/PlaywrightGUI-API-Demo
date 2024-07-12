import { expect } from 'playwright/test';

export const createDefaultUser = async (request, email) => {
  const createNewUser = await request.post('api/users', {
    data: {
      firstname: 'testName',
      lastname: 'testLastName',
      email: email,
      password: 'testPassword',
      avatar: '.\\data\\users\\16709f41-acf3-4738-b4f8-0616a6b6e7ae.jpg',
    },
  });
  expect(createNewUser.ok()).toBeTruthy();
};

export const deleteUser = async (request, email) => {
  const checkIfUserDoesExist = await request.get(`api/users?email=${email}`);
  const body = await checkIfUserDoesExist.json();
  console.log(body);
  if (body.length > 0) {
    const loginToGetAccessToken = await request.post('api/login', {
      data: { email: email, password: 'testPassword' },
    });
    const accessTokenBody = await loginToGetAccessToken.json();
    const accessToken = accessTokenBody.access_token;
    const userId = body[0].id;
    const deleteUser = await request.delete(`api/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(deleteUser.ok()).toBeTruthy();
  }
};

export const logInAsDefaultUserWithGUI = async (page, request, email) => {
  const loginUrl = 'http://localhost:3000/login/';

  await page.goto('/');
  await page.getByTestId('user-dropdown').hover();
  await page.locator('#loginBtn').click();

  expect(page.url()).toBe(loginUrl);

  await createDefaultUser(request, email);

  const welcomeUrl = 'http://localhost:3000/welcome';

  await page.locator('input#username').fill(email);
  await page.locator('#password').fill('testPassword');
  await page.locator('#loginButton').click();

  await page.waitForURL(welcomeUrl);
  expect(page.url()).toBe(welcomeUrl);
  
};
