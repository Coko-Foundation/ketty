const admin = require('../support/credentials')

describe('Checking the Preview section', () => {
  before(() => {
    cy.login(admin)
    cy.addBook('Test Book')
    cy.logout()
  })
  beforeEach(() => {
    cy.login(admin)
    cy.goToBook('Test Book')
    cy.contains('a', 'Preview & Export').click()
  })

  it.skip('checking preview section', () => {
    // seems difficult to check the preview section ???
    // the preview is shown as 1 single element and I cannot interact with the components of it

    // By default, when you log in "Show double page" option is selected
    cy.get('input[value="single"]').should('exist').should('not.be.checked')
    cy.get('input[value="double"]').should('exist').should('be.checked')

    // CANNOT CLICK ANY BUTTONS
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

  it('checking default values for export sidebar', () => {
    cy.contains('New export').should('exist')

    cy.contains('format:')
      .should('exist')
      .parent()
      .find('[title="PDF"]')
      .should('have.text', 'PDF')

    cy.contains('size:')
      .should('exist')
      .parent()
      .find('[title="8.5 x 11 inches, 216 x 279 mm (A4)"]')
      .should('have.text', '8.5 x 11 inches, 216 x 279 mm (A4)')

    const contentOptions = ['Copyright page', 'Table of contents', 'Title page']

    contentOptions.forEach(title => {
      cy.contains('content:')
        .should('exist')
        .parent()
        .find(`[title="${title}"]`)
        .should('have.text', `${title}`)
    })

    cy.contains('templates:').should('exist').parent().find('[alt="vanilla"]')

    cy.contains('You have unsaved changes').should('not.be.visible')

    cy.get('button').contains('Save').parent().should('be.enabled')
    cy.get('button').contains('Download').parent().should('be.enabled')

    // In order to check the carousel for templates is working,
    // checking that the Tenberg template can be selected
    cy.contains('templates:').parent().find('[alt="tenberg"]').click()
    cy.contains('You have unsaved changes').should('be.visible')
  })

  it('creating a new profile export without saving changes', () => {
    cy.contains('You have unsaved changes').should('not.be.visible')

    // changing size, content and template options for PDF format
    // changing size options
    const sizeOptions = [
      { index: 0, title: '8.5 x 11 inches, 216 x 279 mm (A4)' },
      { index: 1, title: '6 x 9 inches, 152 x 229 mm' },
      { index: 2, title: '5.5 x 8.5, 140 x 216 (A5)' },
    ]

    cy.get(`[title="8.5 x 11 inches, 216 x 279 mm (A4)"]`).click()

    sizeOptions.forEach(({ index, title }) => {
      cy.get(`[role="option"]:nth(${index})`).click()

      cy.contains('size:')
        .parent()
        .find(`[title="${title}"]`)
        .should('have.text', title)
        .click()
    })

    // changing content options
    const contentOptions = [0, 1, 2]

    contentOptions.forEach(index => {
      cy.contains('You have unsaved changes').should('be.visible').click()
      cy.contains('Table of contents').parent().click()
      cy.get(`[role="option"]:nth(${index})`).click()
    })

    cy.contains('content:').parent().contains('Please select').should('exist')

    // changing template
    const templates = [
      'vanilla',
      'atosh',
      'bikini',
      'eclypse',
      'lategrey',
      'logical',
      'significa',
      'tenberg',
    ]

    templates.forEach(title => {
      cy.contains('templates:').parent().find(`[alt="${title}"]`).click()
      cy.contains('You have unsaved changes').should('be.visible')
    })

    // changing format option
    // cy.contains('format:').parent().find('[title="PDF"]').click()
    // cy.get('[title="EPUB"]').should('have.text', 'EPUB').click()
  })
})

Cypress.Commands.add('collapseSidebar', () => {
  cy.contains('New export')
    .parent()
    .parent()
    .siblings(':nth(1)')
    .click({ force: true })

  // how to uncollapse though?
})
