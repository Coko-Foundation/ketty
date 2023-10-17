/* eslint-disable jest/expect-expect */
describe('Producer Page', () => {
  beforeEach(() => {
    cy.login()
  })

  it('checking left side panel', () => {
    cy.addBook('Test Book')
    cy.contains('Test Book').click()
    cy.url().should('include', '/producer')
    cy.contains('div', 'Test Book')
    cy.contains('button', 'Book Metadata')
      .should('be.visible')
      .should('not.be.disabled')
      .click()
    cy.get('[data-icon="close"]').click()
    cy.contains('div', 'Chapters')

    // uploading a file
    // cy.get('.ant-btn-icon').first().parent().click()
    // cy.get('input[type="file"]').selectFile(
    //   'cypress/fixtures/docs/test_document.docx',
    //   { force: true },
    // )

    // adding a chapter
    cy.get('.anticon-plus').click()
    cy.contains('Untitled Chapter').click()
    cy.get('[title="Change to Title"]').click()
    cy.get('h1').type('Title of chapter 1')

    // NEEDS TO ADD DND TOO
  })

  it('checking metadata', () => {
    // cy.addBook('Test Book')
    cy.contains('Test Book').click()
    cy.url().should('include', '/producer')

    cy.contains('button', 'Book Metadata').click()

    cy.get('.ant-modal-title').should('have.text', 'Book Metadata')

    cy.get('.ant-modal-body')
      .find('p:nth(0)')
      .should(
        'have.text',
        'This information will be used for additional book pages that are optional, go to Preview to see the pages and decide which ones you want to include in your book',
      )

    // checking default values for title page section
    cy.get('h2').first().should('have.text', 'TITLE PAGE')
    cy.get('label[title="Title"]').should('have.text', 'Title')
    cy.get('#title').should('have.value', 'Test Book')
    cy.get('label[title="Subtitle"]').should('have.text', 'Subtitle')
    cy.get('#subtitle')
      .should('have.attr', 'placeholder', 'Optional')
      .should('be.empty')
    cy.get('label[title="Authors"]').should('have.text', 'Authors')
    cy.get('#authors')
      .should('have.attr', 'placeholder', 'Jhon, Smith')
      .should('be.empty')

    // editing fields of title page section
    // cy.get('#title').type('New title')
    // cy.get('#subtitle').type('New subtitle')
    // cy.get('#authors').type('Test Author')

    // checking default values for copyright page section
    cy.get('h2').last().should('have.text', 'COPYRIGHT PAGE')
    cy.get('label[title="ISBN"]').should('have.text', 'ISBN')
    cy.get('#isbn')
      .should(
        'have.attr',
        'placeholder',
        'Update this ISBN before exporting versions requiring unique identifier',
      )
      .should('be.empty')
    cy.get('label[title="Top of the page"]').should(
      'have.text',
      'Top of the page',
    )
    cy.get('#topPage')
      .should(
        'have.attr',
        'placeholder',
        'Optional - Provide additional description that will appear on the top of the Copyright page',
      )
      .should('be.empty')
    cy.get('label[title="Bottom of the page"]').should(
      'have.text',
      'Bottom of the page',
    )
    cy.get('#bottomPage')
      .should(
        'have.attr',
        'placeholder',
        'Optional - Provide additional description that will appear on the top of the Copyright page',
      )
      .should('be.empty')

    cy.get('label[title="Copyright License"]').should(
      'have.text',
      'Copyright License',
    )

    // All Rights Reserved - Standard Copyright License option
    // cy.get('input[type="radio"]:nth(0)').should('have.attr', 'checked')
    cy.get('strong:nth(0)').should(
      'have.text',
      'All Rights Reserved - Standard Copyright License',
    )
    cy.get('strong:nth(0)')
      .siblings()
      .should(
        'have.text',
        'All Rights Reserved licensing. Your work cannot be distributed, remixed, or otherwise used without your express consent.',
      )

    cy.get('.ant-collapse-expand-icon').click()

    cy.get('label[title="Copyright holder name (optional)"]').should(
      'have.text',
      'Copyright holder name (optional)',
    )
    cy.get('#ncCopyrightHolder').should('be.empty')

    cy.get('label[title="Copyright year (optional)"]').should(
      'have.text',
      'Copyright year (optional)',
    )

    cy.get('#ncCopyrightYear')
      .should('have.attr', 'placeholder', 'Select year')
      .should('be.empty')
  })
})
