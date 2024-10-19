import { test, expect } from "@playwright/test";

test.describe("Finding elements using getByTestId and locators", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/practice/simple-elements-custom-attribute.html");
  });

  test("click the button (using getByTestId)", async ({ page }) => {
    // Arrange:
    const buttonTestId = "simple-button";
    const resultsTestId = "results";
    const expectedMessage = "You clicked the button!";

    // Act:
    const buttonLocator = page.getByTestId(buttonTestId)
    const resultsLocator = page.getByTestId(resultsTestId)
    await buttonLocator.click();

    // Assert:
    await expect(resultsLocator).toHaveText(expectedMessage);
  });

  test("click the button (using locator)", async ({ page }) => {
    // Arrange:
    const buttonTestId = "[pw-test='simple-button']";
    const resultsTestId = "[pw-test='results']";
    const expectedMessage = "You clicked the button!";

    // Act:
    const buttonLocator = page.locator(buttonTestId)
    const resultsLocator = page.locator(resultsTestId)
    await buttonLocator.click();

    // Assert:
    await expect(resultsLocator).toHaveText(expectedMessage);
  });
});