import { test, expect } from 'playwright/test';
import { v4 as UUID4 } from 'uuid';
import { logInAsUserWithGUI } from '../../helpers/users/logInAsUserWithGUI.helpers';
import { deleteUserIfExists } from '../../helpers/users/deleteUserIfExists.helpers';
import { deleteArticleIfExists } from '../../helpers/articles/deleteArticleIfExists.helpers';

test.describe('Test articles with user logged in, then delete article with the same user', () => {
  const email = `test-${UUID4()}@example.com`;

  test.beforeAll(async ({ request }) => {
    const restoreDB = await request.get('/api/restoreDB');
    expect(restoreDB.ok()).toBeTruthy();
  });

  test.beforeEach(async ({ page, request }) => {
    await logInAsUserWithGUI(page, request, email);

    const articlesUrl = 'http://localhost:3000/articles.html';

    await page.getByTestId('open-articles').click();

    expect(page.url()).toBe(articlesUrl);
  });

  test.afterEach(async ({ request }) => {
    await deleteUserIfExists(request, email);
  });

  test(
    'create article with user logged in, then delete article with the same user',
    { tag: ['@happyPath', '@flaky'], annotation: { type: 'info', description: 'flaky when run with 2 workers, because of beforeAll restoreDB race condition' } },
    async ({ page, request }) => {
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
    },
  );

  test('edit article with user logged in, then delete article with the same user', { tag: '@happyPath' }, async ({ page, request }) => {
    await page.locator('#add-new').click();
    await page.getByTestId('title-input').fill('testTitle');
    await page.getByTestId('body-text').fill('testBody');

    const AddResponsePromise = page.waitForResponse((response) => response.url().includes('/api/articles') && response.status() === 201);

    await page.getByTestId('save').click();

    const AddResponse = await AddResponsePromise;
    const headers = AddResponse.headers();
    const locationHeader = headers['location'];
    const articleId = locationHeader.split('/').pop();

    await page.getByTestId('alert-popup').waitFor({ state: 'visible' });
    const alertTextArticleCreated = await page.getByTestId('alert-popup').innerText();
    expect(alertTextArticleCreated).toBe('Article was created');

    await page.getByTestId('edit').click();
    await page.getByTestId('title-input').fill('testTitleEdit');
    await page.getByTestId('body-input').fill('testBodyEdit');
    await page.getByTestId('update').click();

    await page.getByTestId('alert-popup').waitFor({ state: 'visible' });
    const alertTextArticleUpdated = await page.getByTestId('alert-popup').innerText();
    expect(alertTextArticleUpdated).toBe('Article was updated');

    await deleteArticleIfExists(request, articleId, email, 'testPassword');
  });
  // test("delete article when user logged in")
  // test("view article when user logged in")
  // test("list articles when user logged in")
});
