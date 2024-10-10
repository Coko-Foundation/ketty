/* eslint-disable cypress/unsafe-to-chain-command */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getByData', selector => {
  return cy.get(`[data-test=${selector}]`)
})

Cypress.Commands.add('login', user => {
  cy.visit('http://localhost:4000/login')
  cy.contains('Login').should('exist')
  cy.getByData('login-email-input').type(user.email)
  cy.getByData('login-password-input').type(user.password)
  cy.get("button[type='submit']").contains('Log In').click()
  cy.location('pathname').should('equal', '/dashboard')
})

Cypress.Commands.add('addBook', title => {
  cy.visit('http://localhost:4000/dashboard/')
  cy.getByData('dashboard-newBook-button').should('exist')
  cy.getByData('dashboard-newBook-button').click()
  cy.getByData('createBook-startWriting-button').click()
  cy.getByData('rename-bookTitle').find('input').type(title)
  cy.getByData('rename-continue-button').click()
  cy.contains(title)
  cy.get('a[href="/dashboard"]').last().click()
  cy.location('pathname').should('equal', '/dashboard')
  cy.contains(title)
  cy.log(`Book ${title} was created`)
})

Cypress.Commands.add('deleteBook', title => {
  cy.visit('http://localhost:4000/dashboard/')
  cy.contains(title).parent().parent().find('.ant-card-actions li').click()

  cy.contains(title).should('not.exist')
})

Cypress.Commands.add('logout', () => {
  cy.get('[aria-haspopup="dialog"]').first().click()
  // cy.get('.ant-avatar-string', { timeout: 10000 }).click()
  cy.contains('Logout', { timeout: 10000 }).should('exist')
  cy.contains('Logout', { timeout: 10000 }).click({ force: true })
  cy.location('pathname').should('equal', '/login', { timeout: 10000 })
})

Cypress.Commands.add('goToBook', title => {
  cy.contains(title, { timeout: 10000 }).should('exist')
  cy.contains(title).click()
  cy.url().should('include', '/producer')
  cy.contains('div', title)
})

Cypress.Commands.add('signup', user => {
  cy.visit('http://localhost:4000')
  cy.get("a[href='/signup']")
    .contains('Do you want to sign up instead?')
    .click()
  cy.location('pathname').should('equal', '/signup')

  cy.get('#givenNames').type(user.name)
  cy.get('#surname').type(user.surname)
  cy.get('#email').type(user.email)
  cy.get('#password').type(user.password)
  cy.get('#confirmPassword').type(user.password)
  cy.get('#agreedTc').click()

  cy.get('button[type="submit"]').contains('Sign up').click()

  cy.get('div[role="alert"]').should(
    'have.text',
    "Sign up successful!We've sent you a verification email. Click on the link in the email to activate your account.",
  )
  cy.get('div[role="alert"]').contains(
    "We've sent you a verification email. Click on the link in the email to activate your account.",
  )

  cy.visit('http://localhost:4000/login')
})

Cypress.Commands.add('createUntitledChapter', () => {
  cy.url().should('include', '/producer')
  cy.getByData('producer-createChapter-btn').click()
  cy.contains('Untitled Chapter', { timeout: 8000 })
})

Cypress.Commands.add('createChapter', chapterTitle => {
  cy.get('.anticon-plus').click()
  cy.contains('Untitled Chapter')
    .parent()
    .should('have.attr', 'data-selected', 'true')
  cy.get('.ProseMirror').click()
  cy.get('.ProseMirror').type(chapterTitle)
  cy.get('[aria-controls="block-level-options"]').click()
  cy.get(`#block-level-options > :nth-child(${1})`).contains('Title').click({
    timeout: 5000,
    force: true,
  })
})

Cypress.Commands.add('addMember', (collaborator, access) => {
  cy.contains('Untitled Chapter', { timeout: 8000 }).should('exist')
  cy.contains('Untitled Chapter').click()
  cy.contains('Create or select a chapter on the left to start writing.', {
    timeout: 6000,
  })
  cy.contains('button', 'Share').click()
  cy.get('.ant-select-selection-overflow', { timeout: 8000 }).click()
  cy.get('.ant-select-selection-overflow input', { timeout: 8000 })
    // .should('be.visible')
    .click({ force: true })
  cy.get('.ant-select-selection-overflow input', { timeout: 8000 }).type(
    collaborator.email,
  )
  cy.get('div[role="option"]').click()

  cy.get('.ant-select-selection-overflow').should(
    'contain',
    collaborator.name,
    collaborator.surname,
  )

  if (access === 'edit') {
    // Default permission is 'Can view'
    cy.contains('Can view').click()

    // Changing permission to 'Can edit'
    cy.contains('Can edit').click()
    cy.get('button[type="submit"]').click()
  } else if (access === 'view') {
    cy.get('button[type="submit"]').click()
  }

  cy.get('.ant-modal-close').click()
})

Cypress.Commands.add('goToPreview', () => {
  cy.getByData('header-preview-link')
    .should('have.text', 'Preview and Publish')
    .click()
  cy.url().should('include', '/exporter')
})

Cypress.Commands.add('openBookSettings', () => {
  cy.getByData('header-bookSettings-btn').click()
  cy.contains('Book Settings').should('exist')
  cy.contains('AI writing prompt use').should('exist')
})

Cypress.Commands.add('verifySwitch', (switchName, status) => {
  const expectedValue = status === 'enabled' ? 'true' : 'false'

  cy.getByData(`settings-${switchName}-switch`).should(
    'have.attr',
    'aria-checked',
    expectedValue,
  )
})

Cypress.Commands.add('toogleSwitch', switchName => {
  cy.getByData(`settings-${switchName}-switch`).click()
})

Cypress.Commands.add('dragAndDrop', (subject, target) => {
  Cypress.log({
    name: 'DRAGNDROP',
    message: `Dragging element ${subject} to ${target}`,
    consoleProps: () => {
      return {
        subject,
        target,
      }
    },
  })
  const BUTTON_INDEX = 0
  const SLOPPY_CLICK_THRESHOLD = 10
  cy.get(target)
    .first()
    .then($target => {
      const coordsDrop = $target[0].getBoundingClientRect()
      cy.get(subject)
        .first()
        // eslint-disable-next-line no-shadow
        .then(subject => {
          const coordsDrag = subject[0].getBoundingClientRect()
          cy.wrap(subject)
            .trigger('mousedown', {
              button: BUTTON_INDEX,
              clientX: coordsDrag.x,
              clientY: coordsDrag.y,
              force: true,
            })
            .trigger('mousemove', {
              button: BUTTON_INDEX,
              clientX: coordsDrag.x + SLOPPY_CLICK_THRESHOLD,
              clientY: coordsDrag.y,
              force: true,
            })
          cy.get('body')
            .trigger('mousemove', {
              button: BUTTON_INDEX,
              clientX: coordsDrop.x,
              clientY: coordsDrop.y,
              force: true,
            })
            .trigger('mouseup')
        })
    })
})
