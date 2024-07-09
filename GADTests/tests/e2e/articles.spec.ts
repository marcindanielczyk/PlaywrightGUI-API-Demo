import { test, expect } from 'playwright/test';

test.describe('Add articles to GAD', () => {
  test.beforeAll(async ({ request }) => {
    const restoreDB = await request.get('/api/restoreDB');
    expect(restoreDB.ok()).toBeTruthy();
  });

  test.beforeEach(async ({ page }) => {
    const articlesUrl = 'http://localhost:3000/articles.html';

    await page.goto('/');
    await page.locator('#btnGui').click();

    expect(page.url()).toBe(articlesUrl);
  });
});
