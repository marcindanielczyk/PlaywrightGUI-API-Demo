import { test, expect } from '@playwright/test';

test.describe('Locator lists', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/practice/simple-multiple-elements-no-ids.html');
  });

  test('All buttons on page', async ({ page }) => {
    // Arrange:
    const elementRole = 'button';
    const buttonLocator = page.getByRole(elementRole);
    const expectedElementsCount = 7;

    // Assert:
    await expect(buttonLocator).toHaveCount(expectedElementsCount);
  });

  test('Action on third button on the page', async ({ page }) => {
    // Arrange:
    const resultsTestId = 'dti-results';

    const buttonLocator = page.getByRole('button', { name: 'Click here!' });
    const resultsLocator = page.getByTestId(resultsTestId);

    // Act:
    await buttonLocator.click();

    console.log(await resultsLocator.textContent());
  });

  test('Action on nth buttons', async ({ page }) => {
    // Arrange:
    const elementRole = 'button';
    const resultsTestId = 'dti-results';
    const expectedMessage = 'You clicked the button! (Second one!)';

    const buttonLocator = page.getByRole(elementRole);
    const resultsLocator = page.getByTestId(resultsTestId);

    // Act:
    await buttonLocator.nth(2).click();

    // Assert:
    await expect(resultsLocator).toHaveText(expectedMessage);
  });

  test('Action on multiple buttons', async ({ page }) => {
    // Arrange:
    const elementRole = 'button';
    const elementText = 'Click!';
    const resultsTestId = 'dti-results';

    const buttonLocator = page.getByRole(elementRole, { name: elementText });
    const resultsLocator = page.getByTestId(resultsTestId);

    // Act:

    // 1.
    // await buttonLocator.nth(0).click();
    // console.log(await resultsLocator.textContent());
    // await buttonLocator.nth(1).click();
    // console.log(await resultsLocator.textContent());
    // await buttonLocator.nth(2).click();
    // console.log(await resultsLocator.textContent());

    // 2.
    // const numberOfElements = await buttonLocator.count();
    // for (let index = 0; index < numberOfElements; index++) {
    //     await buttonLocator.nth(index).click();
    //     console.log(await resultsLocator.textContent());
    // }

    // 3.
    const allButtonLocators = await buttonLocator.all();
    for (const button of allButtonLocators) {
      await button.click();
      console.log(await resultsLocator.textContent());
    }
  });
});
