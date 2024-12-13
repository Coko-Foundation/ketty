---
title: 'Quality Assurance'
---

Follow this guide if you're contributing to Ketty as a QA Engineer.

## Running the app

1. **Clone the repository** from [KDK](https://gitlab.coko.foundation/coko-org/products/ketty/kdk) and follow the instructions in the “Getting Started” section of the README.
2. **Run Ketty** by executing `docker compose up` in the KDK directory:
3. Once it’s running, you can visit `http://localhost:4000` on your machine to access the local Ketty site.
4. **First-time setup:** Before running the app for the first time, it’s recommended to run `docker compose build`

## Manual testing

Manual testing is done while the app runs in development mode. To test with users, sign up via email using the **default admin credentials:**

- Email: `admin@example.com`
- Password: `password`

### Creating new users locally

You can create users in two ways:

1. Using a script

- In the root of `kdk` folder execute:  
  `docker exec kdk_server_1 node ./scripts/seeds/createVerifiedUser.js author.1@example.com Author 1 author.1`
- Notes:  
  `kdk_server_1` is the name of the server container. Use `docker ps` to confirm this name.  
   Customise each user with unique values, for example:  
   Email (must be unique for each user): *author.1@example.com*  
   First name: _Author_  
   Last name: _1_  
   Username: _author.1_

2. Signing up manually

Since email notifications aren’t configured by default, you need to verify users manually from the database, following these steps:

1. Connect to the database using credentials in `docker-compose.yml`.
2. Update in the database:  
   Set `is_active` to `true` in the `users` table.  
   Set `is_verified` to `true` in the `identities` table.  
   This enables new users to log in and create books.

## Running cypress tests

Tests can only be run locally on the `cypress-tests` branch. Start by running the app in development mode.

### Setup

- In a separate terminal window, navigate to the `ketida-client` folder.
- Run `yarn install` to ensure all dependencies are installed for Cypress.
- In case you don’t have Cypress installed, run `yarn add cypress --dev` in order to install Cypress.

### Running tests

- Open Cypress launchpad with: `npx cypress open`
- Run E2E test files one by one.
- After each test, you’ll need to manually delete the books created during the test.

### Test coverage

Test cases covered by Cypress include:

- [\#749](https://gitlab.coko.foundation/coko-org/products/ketty/ketty/-/quality/test_cases/749) Login, Reset Password and Sign up pages
- [\#750](https://gitlab.coko.foundation/coko-org/products/ketty/ketty/-/quality/test_cases/750) Creating books workflows and dashboard
- [\#751](https://gitlab.coko.foundation/coko-org/products/ketty/ketty/-/quality/test_cases/751) Producer Page
- [\#819](https://gitlab.coko.foundation/coko-org/products/ketty/ketty/-/quality/test_cases/819) User Permissions
- [\#861](https://gitlab.coko.foundation/coko-org/products/ketty/ketty/-/quality/test_cases/861) Preview and Publish Page
- [\#940](https://gitlab.coko.foundation/coko-org/products/ketty/ketty/-/quality/test_cases/940) Admin Dashboard
- [\#953](https://gitlab.coko.foundation/coko-org/products/ketty/ketty/-/quality/test_cases/953) Book Settings
- [\#1005](https://gitlab.coko.foundation/coko-org/products/ketty/ketty/-/quality/test_cases/1005) Knowledge Base

### Potential errors

#### Container name error

If you encounter an error with docker `exec kdk_server_1` (shown in the example below), it may be due to a different container name. The container name might be `kdk_server_1` or `kdk-server-1`, so if you see an error, try replacing it with the other format. Use `docker ps` while the app is running to check the exact container name in your setup and update the command accordingly in the tests in the `kdk/ketida-client/cypress` folder.

```
CypressError

cy.exec('docker exec kdk_server_1 node ./scripts/seeds/createVerifiedUser.js author.1@example.com Author 1 author.1')
failed because the command exited with a non-zero code.

Pass {failOnNonZeroExit: false} to ignore exit code failures.

Information about the failure:
Code: 1

Stderr:
Error response from daemon: No such container: kdk_server_1

```

#### Book Settings and Knowledge Base Tests

To successfully run `bookSettings.cy.js` and `knowledgeBase.cy.js`, ensure the AI integration switch is turned on and a valid AI key is saved in the AI Key field in the Admin interface.

```
If the AI key is missing, the tests checking the AI assistant will fail with error shown below:

(uncaught exception) TypeError: e.map is not a function
(uncaught exception) TypeError: e.map is not a function

(fetch) POST 200 http://localhost:3000/graphql

TypeError

The following error originated from your application code, not from Cypress.

> e.map is not a function
```
