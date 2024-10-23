import { test, expect } from '@playwright/test';

test.describe('Multiple checkboxes exercises', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/practice/simple-multiple-elements-no-ids.html');
  });

  test('Checkbox exercise no.1 - action on multiple checkboxes', async ({ page }) => {
    // Arrange:
    const elementRole = 'checkbox';
    const expectedMessageSelector = 'dti-results';
    const expectedElementsCount = 5;

    const checkboxLocator = page.getByRole(elementRole);
    const expectedMessage = page.getByTestId(expectedMessageSelector);

    const numberOfFoundCheckboxes = await checkboxLocator.count();

    // Act:
    for (let index = 0; index < numberOfFoundCheckboxes; index++) {
      await checkboxLocator.nth(index).check();
      console.log(await expectedMessage.innerText());
    }

    // Assert:
    await expect(checkboxLocator).toHaveCount(expectedElementsCount);
  });

  test('Checkbox exercise no.2 - action on multiple checkboxes (with assertion)', async ({ page }) => {
    // Arrange:
    const elementRole = 'checkbox';
    const expectedMessageSelector = 'dti-results';
    const expectedElementsCount = 5;

    const checkboxLocator = page.getByRole(elementRole);
    const expectedMessage = page.getByTestId(expectedMessageSelector);

    const numberOfFoundCheckboxes = await checkboxLocator.count();

    // Assert:
    await expect(checkboxLocator).toHaveCount(expectedElementsCount);

    for (let index = 0; index < numberOfFoundCheckboxes; index++) {
      // Act:
      await checkboxLocator.nth(index).check();
      console.log(await expectedMessage.innerText());
      // Assert:
      await expect.soft(expectedMessage).toHaveText(`Checkbox is checked! (Opt ${index + 1}!)`);
    }
  });

  test('Checkbox exercise no.3 - action on multiple checkboxes (with assertion and data structure for results inner text)', async ({ page }) => {
    // Arrange:
    const elementRole = 'checkbox';
    const expectedMessageSelector = 'dti-results';
    const expectedElementsCount = 5;
    const expectedMessages = {
      0: 'Checkbox is checked! (Opt 1!)',
      1: 'Checkbox is checked! (Opt 2!)',
      2: 'Checkbox is checked! (Opt 3!)',
      3: 'Checkbox is checked! (Opt 4!)',
      4: 'Checkbox is checked! (Opt 5!)',
    };

    const checkboxLocator = page.getByRole(elementRole);
    const expectedMessage = page.getByTestId(expectedMessageSelector);

    const numberOfFoundCheckboxes = await checkboxLocator.count();

    // Assert:
    await expect(checkboxLocator).toHaveCount(expectedElementsCount);

    for (let index = 0; index < numberOfFoundCheckboxes; index++) {
      // Act:
      await checkboxLocator.nth(index).check();
      console.log(await expectedMessage.innerText());
      // Assert:
      await expect.soft(expectedMessage).toHaveText(expectedMessages[index]);
    }
  });
});
