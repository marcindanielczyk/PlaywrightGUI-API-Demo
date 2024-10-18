import { test, expect } from '@playwright/test';

test.describe('Finding checkbox with different locators', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/practice/simple-elements.html');
  });

  test('Find label element by id', async ({ page }) => {
    const elementSelector = '#id-checkbox';
    const elementLocator = page.locator(elementSelector);

    await expect(elementLocator).toBeVisible();
  });

  test('Find label element by class', async ({ page }) => {
    const elementSelector = '.my-checkbox';
    const elementLocator = page.locator(elementSelector);

    await expect(elementLocator).toBeVisible();
  });

  test('Find label element by role', async ({ page }) => {
    const elementSelector = 'checkbox';
    const elementLocator = page.getByRole(elementSelector);

    await expect(elementLocator).toBeVisible();
  });

  test('Find label element by data-test-id', async ({ page }) => {
    const elementSelector = 'dti-checkbox';
    const elementLocator = page.getByTestId(elementSelector);

    await expect(elementLocator).toBeVisible();
  });

  test('Find label element by ckbx custom attribute', async ({ page }) => {
    const elementSelector = "[ckbx = 'val1']";
    const elementLocator = page.locator(elementSelector);

    await expect(elementLocator).toBeVisible();
  });
});
