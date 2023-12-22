const { admin } = require('../support/credentials')

describe('Checking the Preview section', () => {
  // before(() => {
  //   cy.login(admin)
  //   cy.addBook('Test Book')
  //   cy.logout()
  // })
  beforeEach(() => {
    cy.login(admin)
    cy.goToBook('Test Book')
    cy.contains('a', 'Preview & Export').click()
  })

  it('checking preview section', () => {
    // seems difficult to check the preview section ???
    // cy.get('header:nth(1)').scrollIntoView()
    // cy.contains('h1', 'Test Book').should('exist')

    // By default, when you log in "Show double page" option is selected
    cy.get('input[value="single"]').should('exist').should('not.be.checked')
    cy.get('input[value="double"]').should('exist').should('be.checked')

    // Why doesn't clicking work???
    // cy.get('input[value="single"]').parent().parent().click({ force: true })
    // cy.wait(5000)
    // cy.get('input[value="single"]').should('be.checked')

    cy.contains('div', '100 %').should('exist')
    cy.get('span[aria-label="zoom-out"]')
      .parent()
      .parent()
      .should('not.be.disabled')
    cy.get('span[aria-label="zoom-in"]').parent().parent().should('be.disabled')

    // why can I not click buttons
    cy.get('button:nth(1)').click()
    cy.contains('div', '90 %').should('exist')
  })
})
