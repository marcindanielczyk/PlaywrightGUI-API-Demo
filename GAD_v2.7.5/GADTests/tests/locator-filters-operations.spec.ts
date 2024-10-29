import { test, expect } from '@playwright/test';

test.describe('Locator filters', () => {
  // https://playwright.dev/docs/locators#locator-operators

  test.beforeEach(async ({ page }) => {
    await page.goto('/practice/simple-multiple-elements-no-ids.html');
  });

  test.describe('Finding element - different approaches', () => {
    test('Single button click using options', async ({ page }) => {
      // Arrange:
      const elementRole = 'button';
      const resultsTestId = 'dti-results';
      const expectedMessage = 'You clicked the button!';
      const elementText = "Click me!";

      const buttonLocator = page.getByRole(elementRole, { name : elementText });

      // Act:

      
      // Assert:
    });

    test('Single button click (using filter and hasText)', async ({ page }) => {
      // Arrange:
      // Act:
      // Assert:
    });
  });

  test.describe('Buttons in table - different approaches', () => {
    test('Single button click (chained getBy)', async ({ page }) => {
      // Arrange:
      // Act:
      // Assert:
    });

    test('Single button click (using filter and has)', async ({ page }) => {
      // Arrange:
      // Act:
      // Assert:
    });

    test('Single button click (using filter and hasText)', async ({ page }) => {
      // Arrange:
      // Act:
      // Assert:
    });

    test('Single button click (using filter by child)', async ({ page }) => {
      // Arrange:
      // Act:
      // Assert:
    });
  });
});
