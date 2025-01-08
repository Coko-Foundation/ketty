/* eslint-disable jest/expect-expect */
describe('Start writing', () => {
  beforeEach(() => {
    cy.login()
  })

  it('creating a book by importing files', () => {
    cy.getByData('import-files-button')
      .should('have.text', 'Import your files')
      .click()

    cy.get('h1').should('have.text', 'Import')
    cy.get('p').first().should('have.text', 'Files supported: .doc, .docx')

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

    cy.getByData('continue-btn')
      .should('have.text', 'Continue')
      .should('be.disabled')

    cy.getByData('upload-files-btn').selectFile(
      'cypress/fixtures/docs/test_document.docx',
      { force: true },
    )

    cy.get('.ant-upload-drag').should('contain', 'test_document.docx')

    cy.getByData('continue-btn').click()

    cy.getByData('book-title-input')
      .invoke('attr', 'placeholder')
      .should('contain', 'Book title')

    cy.getByData('book-title-input')
      .parent()
      .find('p')
      .should(
        'have.text',
        "Don't overthink it, you can change your title at any time",
      )

    cy.getByData('book-title-input')
      .parent()
      .find('button')
      .should('have.text', 'Continue')
      .should('be.disabled')

    cy.getByData('book-title-input').type('Book Two')

    cy.getByData('book-title-input')
      .parent()
      .find('button')
      .should('have.text', 'Continue')
      .click()

    cy.contains('Book Metadata')
    cy.contains('Book Two')

    // cy.getByData('book-chapters-list').wait(10000)
    cy.contains('test_document')

    /*    cy.get("a[href='/dashboard']").last().click()
      cy.location("pathname").should("equal", "/dashboard")
      cy.log("Confirms that book exists in the dashboard")
      cy.get(".ant-card-body").contains("Book Two")
      cy.log("Deletes book from dashboard")
      cy.deleteBook("Book Two") */
  })
})
