import { expect } from 'playwright/test';
import { createUser } from './createUser.helpers.ts';

export async function logInAsUserWithGUI(page, request, email) {
  const loginUrl = 'http://localhost:3000/login/';

  await page.goto('/');
  await page.getByTestId('user-dropdown').hover();
  await page.locator('#loginBtn').click();

  expect(page.url()).toBe(loginUrl);

  await createUser(request, email);

  const welcomeUrl = 'http://localhost:3000/welcome';

  await page.locator('input#username').fill(email);
  await page.locator('#password').fill('testPassword');
  await page.locator('#loginButton').click();

  await page.waitForURL(welcomeUrl);
  expect(page.url()).toBe(welcomeUrl);
}
