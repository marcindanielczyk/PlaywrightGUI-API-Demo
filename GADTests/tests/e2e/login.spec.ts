import { test, expect } from 'playwright/test';

test.describe('User login to GAD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('user-dropdown').hover();
    await page.locator('#loginBtn').click();
  });

  test('user should log in with valid credentials', { tag: '@happyPath' }, async ({ page }) => {
    const userEmail = 'testEmail@testmail.com';
    const userPassword = 'testPassword';
    const welcomeUrl = 'http://localhost:3000/welcome';

    await page.locator('#username').nth(1).fill(userEmail);
    await page.locator('#password').fill(userPassword);
    await page.locator('#loginButton').click();

    await page.waitForURL(welcomeUrl);
    expect(page.url()).toBe(welcomeUrl);
  });

  // mockowanie jest stabilniejsze i szybsze, ale trudniejsze
  // dodanie usera bezposrednio w teście jest łatwiejsze
  // pytanie brzmi czy w testach e2e mam uzywać łączenia api z gui? (w sumie w registration juz uzylem api do restora bazy to nie wiem czy tak robic)
  // wiec tez w registration przy testach databasedependent zmienic na mocka, albo utworzyć bezposrednio w kodzie usera przy pomocy api(?) (lepij gui(?) czy nie)

  // test('user should not log in if does not exist', { tag: '@unhappyPath'}, async ({page}) => {});

  // user should not log in without email provided

  // user should not log in without password provided
});
