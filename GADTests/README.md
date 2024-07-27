# GAD Test Automation

This project contains automated tests for the GUI and API Demo (GAD) web application by creators of jaktestowac.pl, using Playwright and TypeScript.

## Test scenarios and test cases

### 1. User Login

File: [login.spec.ts](tests/e2e/login.spec.ts)

- User should log in with valid credentials
- User should not log in if they do not exist
- User should not log in without email provided
- User should not log in without password provided

### 2. User Registration

File: [registration.spec.ts](tests/e2e/registration.spec.ts)

- User should register with valid credentials
- User should not register with email not unique
- User should not register without email
- User should not register without first name
- User should not register without last name
- User should not register without password

### 3. Articles Management

File: [articles.spec.ts](tests/e2e/articles.spec.ts)

- create article with authenticated user
- update article with authenticated user
- delete article with authenticated user

## Helper Functions

- [createDefaultUser.ts](helpers/users/createDefaultUser.ts): Creates a default user
- [deleteUserIfExists.ts](helpers/users/deleteUserIfExists.ts): Deletes a user if they exist
- [logInAsDefaultUserWithGUI.ts](helpers/users/logInAsDefaultUserWithGUI.ts): Logs in as a default user using the GUI
- [logInAsDefaultUserToGetAccessToken.ts](helpers/users/logInAsDefaultUserToGetAccessToken.ts): Logs in as a default user to obtain an access token

## Configuration

The project uses Playwright for test automation. Configuration can be found in [playwright.config.ts](playwright.config.ts).

## Running Tests

- To run the tests, use the following command  
  `npx playwright test`

For more detailed information on running tests and configuring Playwright, refer to the official Playwright documentation.


