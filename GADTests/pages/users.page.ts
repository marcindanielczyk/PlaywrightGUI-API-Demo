import { expect } from 'playwright/test';

export const createUser = async (request, email) => {
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
