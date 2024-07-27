# GAD Test Automation

This project contains automated tests for the GUI and API Demo (GAD) web application by creators of jaktestowac.pl, using Playwright and TypeScript.

## Test scenarios and test cases

### 1. User Login

File: [login.spec.ts](tests/e2e/login.spec.ts)

- user should log in with valid credentials
- user should not log in if they do not exist
- user should not log in without email provided
- user should not log in without password provided

### 2. User Registration

File: [registration.spec.ts](tests/e2e/registration.spec.ts)

- user should register with valid credentials
- user should not register with email not unique
- user should not register without email
- user should not register without first name
- user should not register without last name
- user should not register without password

### 3. Articles Management

File: [articles.spec.ts](tests/e2e/articles.spec.ts)

- create article with authenticated user
- update article with authenticated user
- delete article with authenticated user

## Helper Functions

- [deleteArticleIfExists.helpers.ts](helpers/articles/deleteArticleIfExists.helpers.ts): deletes an article if it exists
- [createUser.helpers.ts](helpers/users/createUser.helpers.ts): creates a user
- [deleteUserIfExists.helpers.ts](helpers/users/deleteUserIfExists.helpers.ts): deletes a user if they exist
- [logInAsUserWithGUI.helpers.ts](helpers/users/logInAsUserWithGUI.helpers.ts): logs in as a user using the GUI
- [logInAsUserToGetAccessToken.helpers.ts](helpers/users/logInAsUserToGetAccessToken.helpers.ts): logs in as a user to obtain an access token

## Configuration

The project uses Playwright for test automation. Configuration can be found in [playwright.config.ts](playwright.config.ts).

## Running Tests

- To run the tests, use the following command  
  `npx playwright test`

For more detailed information on running tests and configuring Playwright, refer to the official Playwright documentation.


