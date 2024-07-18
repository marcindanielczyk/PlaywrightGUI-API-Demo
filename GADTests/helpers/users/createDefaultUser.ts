import { expect } from 'playwright/test';

export async function createDefaultUser(request, email) {
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
}
