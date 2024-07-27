import { test, expect } from 'playwright/test';
import { v4 as UUID4 } from 'uuid';
import { logInAsUserWithGUI } from '../../helpers/users/logInAsUserWithGUI.helpers';
import { deleteUserIfExists } from '../../helpers/users/deleteUserIfExists.helpers';
import { deleteArticleIfExists } from '../../helpers/articles/deleteArticleIfExists.helpers';

test.describe('Articles CRUD operations with authenticated user', () => {
  const testUserEmail = `test-${UUID4()}@example.com`;

  test.beforeAll(async ({ request }) => {
    const dbRestoreResponse = await request.get('/api/restoreDB');
    expect(dbRestoreResponse.ok()).toBeTruthy();
  });

  test.beforeEach(async ({ page, request }) => {
    await logInAsUserWithGUI(page, request, testUserEmail);

    const articlesPageUrl = 'http://localhost:3000/articles.html';
    await page.getByTestId('open-articles').click();
    expect(page.url()).toBe(articlesPageUrl);
  });

  test.afterEach(async ({ request }) => {
    await deleteUserIfExists(request, testUserEmail);
  });

  test('create article with authenticated user', { tag: ['@happyPath', '@flaky'], annotation: { type: 'info', description: 'flaky when run with 2 workers, because of beforeAll restoreDB race condition' } }, async ({ page, request }) => {
    await page.locator('#add-new').click();
    await page.getByTestId('title-input').fill('testTitle');
    await page.getByTestId('body-text').fill('testBody');

    const createArticleResponsePromise = page.waitForResponse((response) => response.url().includes('/api/articles') && response.status() === 201);
    await page.getByTestId('save').click();
    const createArticleResponse = await createArticleResponsePromise;

    const responseHeaders = createArticleResponse.headers();
    const newArticleLocation = responseHeaders['location'];
    const newArticleId = newArticleLocation.split('/').pop();

    await page.getByTestId('alert-popup').waitFor({ state: 'visible' });
    const createAlertText = await page.getByTestId('alert-popup').innerText();
    expect(createAlertText).toBe('Article was created');

    await deleteArticleIfExists(request, newArticleId, testUserEmail, 'testPassword');
  });

  test('update article with authenticated user', { tag: '@happyPath' }, async ({ page, request }) => {
    const updatedTitle = 'testTitleEdit';
    const updatedBody = 'testBodyEdit';

    await page.locator('#add-new').click();
    await page.getByTestId('title-input').fill('testTitle');
    await page.getByTestId('body-text').fill('testBody');

    const createArticleResponsePromise = page.waitForResponse((response) => response.url().includes('/api/articles') && response.status() === 201);
    await page.getByTestId('save').click();
    const createArticleResponse = await createArticleResponsePromise;

    const createResponseHeaders = createArticleResponse.headers();
    const newArticleLocation = createResponseHeaders['location'];
    const articleId = newArticleLocation.split('/').pop();

    await page.getByTestId('alert-popup').waitFor({ state: 'visible' });
    const createAlertText = await page.getByTestId('alert-popup').innerText();
    expect(createAlertText).toBe('Article was created');

    await page.getByTestId('edit').click();
    await page.getByTestId('title-input').fill(updatedTitle);
    await page.getByTestId('body-input').fill(updatedBody);

    const updateArticleResponsePromise = page.waitForResponse((response) => response.url().includes('/api/articles') && response.status() === 200);
    await page.getByTestId('update').click();
    await updateArticleResponsePromise;

    await page.getByTestId('alert-popup').waitFor({ state: 'visible' });
    const updateAlertText = await page.getByTestId('alert-popup').innerText();
    expect(updateAlertText).toBe('Article was updated');

    const updatedTitleText = await page.getByTestId('article-title').innerText();
    const updatedBodyText = await page.getByTestId('article-body').innerText();
    expect(updatedTitleText).toBe(updatedTitle);
    expect(updatedBodyText).toBe(updatedBody);

    await deleteArticleIfExists(request, articleId, testUserEmail, 'testPassword');
  });

  test('delete article with authenticated user', { tag: '@happyPath' }, async ({ page, request }) => {
    await page.locator('#add-new').click();
    await page.getByTestId('title-input').fill('testTitle');
    await page.getByTestId('body-text').fill('testBody');

    const createArticleResponsePromise = page.waitForResponse((response) => response.url().includes('/api/articles') && response.status() === 201);
    await page.getByTestId('save').click();
    const createArticleResponse = await createArticleResponsePromise;

    const createResponseHeaders = createArticleResponse.headers();
    const newArticleLocation = createResponseHeaders['location'];
    const articleId = newArticleLocation.split('/').pop();

    await page.getByTestId('alert-popup').waitFor({ state: 'visible' });
    const createAlertText = await page.getByTestId('alert-popup').innerText();
    expect(createAlertText).toBe('Article was created');

    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('Are you sure that you want to delete item');
      await dialog.accept();
    });

    const deleteArticleResponsePromise = page.waitForResponse((response) => response.url().includes('/api/articles') && response.status() === 200);
    await page.getByTestId('delete').click();
    const deleteArticleResponse = await deleteArticleResponsePromise;
    expect(deleteArticleResponse.status()).toBe(200);
  });
});