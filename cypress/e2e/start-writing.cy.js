/* eslint-disable jest/expect-expect */
describe('Start writing', () => {
  beforeEach(() => {
    cy.login()
  })

  it('creating a book by clicking "Start writing" button', () => {
    cy.getByData('start-writing-button')
      .should('have.text', 'Start writing your book')
      .click()

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

    cy.getByData('book-title-input').type('Book One')

    cy.getByData('book-title-input')
      .parent()
      .find('button')
      .should('have.text', 'Continue')
      .click()

    cy.contains('Book Metadata')
    cy.contains('Book One')
    cy.get("a[href='/dashboard']").last().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.log('Confirms that book exists in the dashboard')
    cy.get('.ant-card-body').contains('Book One')
    cy.log('Deletes book from dashboard')
    cy.deleteBook('Book One')
  })
})
