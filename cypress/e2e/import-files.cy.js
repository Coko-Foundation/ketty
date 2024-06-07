/* eslint-disable jest/expect-expect */
const { admin } = require('../support/credentials')

describe('Start writing', () => {
  beforeEach(() => {
    cy.login(admin)
  })

  it('creating a book by importing files', () => {
    // cy.getByData('import-files-button')
    cy.location('pathname').should('equal', '/dashboard')
    cy.contains('You don’t have any books yet').should('exist')
    cy.contains('[href="/create-book"]', 'New book').should('exist')
    cy.contains('[href="/create-book"]', 'New book').click()

    cy.location('pathname').should('equal', '/create-book')
    cy.contains('h2', 'Upload your files')
    cy.contains('p', 'Start your book with .docx files.')
    cy.contains('button', 'Select files').click()

    cy.location('pathname').should('contain', '/import')
    cy.get('h1').should('have.text', 'Import')
    cy.get('p').first().should('have.text', 'Files supported: .docx')

    cy.get('p')
      .last()
      .should(
        'have.text',
        ' Each file you upload will be a separate chapter in your book. You can reorder chapters and import more chapters later.',
      )

    cy.get('.ant-upload-drag').should(
      'have.text',
      'Drag and drop files, or Browse',
    )

    // cy.getByData('continue-btn')
    cy.get('button:nth(2)')
      .should('have.text', 'Continue')
      .should('be.disabled')

    // cy.getByData('upload-files-btn')
    cy.get('input[type="file"]').selectFile(
      'cypress/fixtures/docs/test_document.docx',
      { force: true },
    )

    cy.get('.ant-upload-drag').should('contain', 'test_document.docx')
    cy.get('[data-icon="close"]').click()

    cy.uploadMultipleFiles([
      'chapter1_test.docx',
      'chapter2_test.docx',
      'chapter3_test.docx',
    ])

    cy.contains('Continue').click()

    // cy.getByData('book-title-input')
    cy.get('#bookTitle')
      .invoke('attr', 'placeholder')
      .should('contain', 'Book title')

    cy.get('form')
      .find('p')
      .should(
        'have.text',
        "Don't overthink it, you can change your title at any time",
      )

    cy.get('form')
      .find('button')
      .should('have.text', 'Continue')
      .should('be.disabled')

    cy.get('#bookTitle').type('Book Two')

    cy.get('form').find('button').should('have.text', 'Continue').click()

    cy.contains('Book Metadata')
    cy.contains('Book Two')

    // cy.getByData('book-chapters-list').wait(10000)
    cy.get('ul:nth(0)').contains('Processing')
    cy.get('ul:nth(0)').contains('chapter1_test', { timeout: 8000 })
    cy.get('ul:nth(0)').contains('chapter2_test', { timeout: 8000 })
    cy.get('ul:nth(0)').contains('chapter3_test', { timeout: 8000 })

    cy.get("a[href='/dashboard']").last().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.log('Confirms that book exists in the dashboard')
    cy.get('.ant-card-body').contains('Book Two')
  })
})

Cypress.Commands.add('uploadMultipleFiles', filePaths => {
  filePaths.forEach(filePath => {
    cy.get('input[type="file"]').selectFile(
      `cypress/fixtures/docs/${filePath}`,
      { force: true },
    )
  })
})
