import { test, expect } from 'playwright/test';
import { v4 as UUID4 } from 'uuid';
import { logInAsUserWithGUI } from '../../helpers/users/logInAsUserWithGUI.helpers';
import { deleteUserIfExists } from '../../helpers/users/deleteUserIfExists.helpers';
import { deleteArticleIfExists } from '../../helpers/articles/deleteArticleIfExists.helpers';

test.describe('Test articles with user logged in to GAD, then delete article with the same user', () => {
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

  test('create article with user logged in', { tag: ['@happyPath', '@flaky'], annotation: { type: 'info', description: 'flaky when run with 2 workers, because of beforeAll restoreDB race condition' } }, async ({ page, request }) => {
    await page.locator('#add-new').click();
    await page.getByTestId('title-input').fill('testTitle');
    await page.getByTestId('body-text').fill('testBody');

    const responsePromise = page.waitForResponse((response) => response.url().includes('/api/articles') && response.status() === 201);

    await page.getByTestId('save').click();

    const response = await responsePromise;

    const headers = response.headers();
    const articleLocation = headers['location'];
    const articleId = articleLocation.split('/').pop();

    await page.getByTestId('alert-popup').waitFor({ state: 'visible' });
    const alertText = await page.getByTestId('alert-popup').innerText();
    expect(alertText).toBe('Article was created');

    await deleteArticleIfExists(request, articleId, email, 'testPassword');
  });

  test('update article with user logged in', { tag: '@happyPath' }, async ({ page, request }) => {
    const updatedTitle = 'testTitleEdit';
    const updatedBody = 'testBodyEdit';

    await page.locator('#add-new').click();
    await page.getByTestId('title-input').fill('testTitle');
    await page.getByTestId('body-text').fill('testBody');

    const createResponsePromise = page.waitForResponse((response) => response.url().includes('/api/articles') && response.status() === 201);

    await page.getByTestId('save').click();

    const createResponse = await createResponsePromise;
    const createHeaders = createResponse.headers();
    const createLocation = createHeaders['location'];
    const createArticleId = createLocation.split('/').pop();

    await page.getByTestId('alert-popup').waitFor({ state: 'visible' });
    const alertTextArticleCreated = await page.getByTestId('alert-popup').innerText();
    expect(alertTextArticleCreated).toBe('Article was created');

    await page.getByTestId('edit').click();
    await page.getByTestId('title-input').fill(updatedTitle);
    await page.getByTestId('body-input').fill(updatedBody);
    await page.getByTestId('update').click();

    await page.waitForResponse(response => response.url().includes('/api/articles') && response.status() === 200);

    await page.getByTestId('alert-popup').waitFor({ state: 'visible' });
    const alertTextArticleUpdated = await page.getByTestId('alert-popup').innerText();
    expect(alertTextArticleUpdated).toBe('Article was updated');

    const updatedTitleValue = await page.getByTestId('article-title').innerText();
    const updatedBodyValue = await page.getByTestId('article-body').innerText();
    expect(updatedTitleValue).toBe(updatedTitle);
    expect(updatedBodyValue).toBe(updatedBody);

    await deleteArticleIfExists(request, createArticleId, email, 'testPassword');
  });
  // test("delete article when user logged in")
  // test("view article when user logged in")
  // test("list articles when user logged in")
});
