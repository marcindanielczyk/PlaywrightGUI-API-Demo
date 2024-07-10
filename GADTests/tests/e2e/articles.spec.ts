import { test, expect } from 'playwright/test';

test.describe('Test articles in GAD', () => {
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


  // test('create article when user logged in')
  // test("edit article when user logged in")
  // test("delete article when user logged in")
  // test("view article when user logged in")
  // test("list articles when user logged in")


  // test('create article without user logged in')
  // test("edit article without user logged in")
  // test("delete article without user logged in")
  // test("view article without user logged in")
  // test("list articles without user logged in")
});
