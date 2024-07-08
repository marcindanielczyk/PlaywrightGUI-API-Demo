import { test, expect } from 'playwright/test';

test.describe('Add articles to GAD', () => {
  test.beforeAll(async ({ request }) => {
    const restoreDB = await request.get('/api/restoreDB');
    expect(restoreDB.ok()).toBeTruthy();
  });
});
