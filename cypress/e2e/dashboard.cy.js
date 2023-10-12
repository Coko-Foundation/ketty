/* eslint-disable jest/expect-expect */
describe('checking elements of the dashboard', () => {
  beforeEach(() => {
    cy.login()
    // cy.addBook('Book 1')
  })

  it('uploading a dashboard image for a book', () => {
    cy.get('li:nth(0)').should('contain', 'Book 1')
    cy.get('li:nth(0)').find('[data-icon="more"]').click()
    cy.contains('Upload book placeholder image').should('exist')

    cy.get('input[type="file"].SimpleUpload__HiddenInput-sc-1y6v8od-0.hRHGEm')
      .should('exist') // Check if the element exists
      .then($input => {
        cy.wrap($input).selectFile('cypress/fixtures/images/Design1.jpg', {
          force: true,
        })
      })

    cy.log('Replacing an existing dashboard image')

    cy.get('input[type="file"].SimpleUpload__HiddenInput-sc-1y6v8od-0.hRHGEm')
      .should('exist') // Check if the element exists
      .then($input => {
        cy.wrap($input).selectFile('cypress/fixtures/images/Design2.jpg', {
          force: true,
        })
      })
  })

  it('deleting a book', () => {
    cy.addBook('Book 2')
    cy.get('li:nth(1)').should('contain', 'Book 2')
    cy.get('li:nth(1)').find('[data-icon="more"]').click()
    cy.contains('Delete').should('exist').click()
    cy.contains('Book 2').should('not.exist')
  })

  //   it.skip('checking that books are sorted in ascending order', () => {
  //     // Adding 10 books with titles "Book 2" to "Book 11"
  //     // for (let i = 2; i <= 11; i++) {
  //     //   cy.addBook(`Book ${i}`)
  //     // }

  //     // Verifying the ordering
  //     cy.get('li')
  //       //      .should('have.length', 11) // Make sure there are 11 books
  //       .invoke('text')
  //       .then(titles => {
  //         // Sort the book titles in ascending order
  //         const sortedTitles = titles.sort()

  //         // Verify that the sorted titles match the expected order      })
  //   })
})
