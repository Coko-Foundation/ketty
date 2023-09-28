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

Cypress.Commands.add('login', () => {
  cy.visit('http://localhost:4000')
  cy.getByData('email-input').type('admin@example.com')
  cy.getByData('password-input').type('password')
  cy.get("button[type='submit']").contains('Log in').click()
  cy.location('pathname').should('equal', '/dashboard')
})

Cypress.Commands.add('deleteBook', title => {
  cy.visit('http://localhost:4000/dashboard/')
  cy.contains(title).parent().parent().find('.ant-card-actions li').click()

  cy.contains(title).should('not.exist')
})
