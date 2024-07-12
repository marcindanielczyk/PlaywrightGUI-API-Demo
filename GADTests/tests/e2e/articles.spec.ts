import { test, expect } from 'playwright/test';
import { v4 as UUID4 } from 'uuid';
import { logInAsDefaultUserWithGUI } from '../../pages/users.page';

test.describe('Test articles with user logged in to GAD', () => {
  test.beforeAll(async ({ request }) => {
    const restoreDB = await request.get('/api/restoreDB');
    expect(restoreDB.ok()).toBeTruthy();
  });

  test.beforeEach(async ({ page, request }) => {
    const email = `test-${UUID4()}@example.com`;
    await logInAsDefaultUserWithGUI(page, request, email);

    const articlesUrl = 'http://localhost:3000/articles.html';

    await page.getByTestId('open-articles').click();

    expect(page.url()).toBe(articlesUrl);
  });

  test('create article when user logged in', { tag: '@happyPath' }, async ({ page }) => {
    await page.locator('#add-new').click();
    await page.getByTestId('title-input').fill('testTitle');
    await page.getByTestId('body-text').fill('testBody');
    await page.getByTestId('save').click();

    await page.getByTestId('alert-popup').waitFor({ state: 'visible' });

    const alertText = await page.getByTestId('alert-popup').innerText();
    expect(alertText).toBe('Article was created');
  });
  // test("edit article when user logged in")
  // test("delete article when user logged in")
  // test("view article when user logged in")
  // test("list articles when user logged in")
});
