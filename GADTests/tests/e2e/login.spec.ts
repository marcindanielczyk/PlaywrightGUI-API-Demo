import { test, expect } from 'playwright/test';

test.describe('User login to GAD', () => {
  const firstNameId = 'testName';
  const lastNameId = 'testLastName';
  const emailId = 'okokokok@testmail.com';
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

    const createNewUser = await request.post('/api/users', {
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

  test('user should log in with valid credentials', { tag: '@happyPath' }, async ({ page, request }) => {
    const welcomeUrl = 'http://localhost:3000/welcome';

    // w wypadku takiego dodania uzytkownika i tak przy kolejnym puszczeniu testu, ten uzytkownik juz istnieje wiec jest konflikt, stworzony uzytkownik
    // czyli no zostaje ten restoreDB, prawdziwy mock albo stworzyenie uzytkownika w beforeEach/beforeAll i usuniecie go po wykonaniu testow afterall/aftereach
    // no jeszcze moze byc usuniecie go tylko po tym tescie czy jakos tak
    // tez teoretycznie tego fakera mozna sprobowac no ale nwm

    await page.locator('input#username').fill(emailId);
    await page.locator('#password').fill(passwordId);
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
