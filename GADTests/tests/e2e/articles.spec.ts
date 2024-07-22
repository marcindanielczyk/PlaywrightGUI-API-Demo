import { test, expect } from 'playwright/test';
import { v4 as UUID4 } from 'uuid';
import { logInAsDefaultUserWithGUI } from '../../helpers/users/logInAsDefaultUserWithGUI';
import { deleteUserIfExists } from '../../helpers/users/deleteUserIfExists';
import { deleteArticleIfExists } from '../../helpers/articles/deleteArticleIfExists';

test.describe('Test articles with user logged in to GAD', () => {
  const email = `test-${UUID4()}@example.com`;

  test.beforeAll(async ({ request }) => {
    const restoreDB = await request.get('/api/restoreDB');
    expect(restoreDB.ok()).toBeTruthy();
  });

  test.beforeEach(async ({ page, request }) => {
    await logInAsDefaultUserWithGUI(page, request, email);

    const articlesUrl = 'http://localhost:3000/articles.html';

    await page.getByTestId('open-articles').click();

    expect(page.url()).toBe(articlesUrl);
  });

  test.afterEach(async ({ request }) => {
    await deleteUserIfExists(request, email);
  });

  test('create article with user logged in', { tag: ['@happyPath', '@flaky'], annotation: { type: 'info', description: 'flaky when run with 2 workers, because of beforeAll restoreDB race condition' } }, async ({ page, request }) => {
    await page.locator('#add-new').click();
    await page.getByTestId('title-input').fill('testTitle');
    await page.getByTestId('body-text').fill('testBody');

    const responsePromise = page.waitForResponse((response) => response.url().includes('/api/articles') && response.status() === 201);

    await page.getByTestId('save').click();

    const response = await responsePromise;

    const headers = response.headers();
    const locationHeader = headers['location'];
    const articleId = locationHeader.split('/').pop();

    await page.getByTestId('alert-popup').waitFor({ state: 'visible' });
    const alertText = await page.getByTestId('alert-popup').innerText();
    expect(alertText).toBe('Article was created');

    await deleteArticleIfExists(request, articleId, email, 'testPassword');
  });

  // test('edit article with user logged in', { tag: '@happyPath' }, async ({ page }) => {});
  // test("delete article when user logged in")
  // test("view article when user logged in")
  // test("list articles when user logged in")
});
