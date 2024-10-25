/* eslint-disable no-plusplus */
/* eslint-disable jest/valid-expect */
/* eslint-disable jest/expect-expect */
const { admin } = require('../support/credentials')

describe('checking elements of the dashboard', () => {
  before(() => {
    cy.login(admin)
    cy.addBook('Book 1')
    cy.logout()
  })

  beforeEach(() => {
    cy.login(admin)
  })

  it('uploading a dashboard image for a book', () => {
    cy.get('li:nth(0)').should('contain', 'Book 1')
    cy.get('li:nth(0)').find('[data-icon="more"]').click()
    cy.contains('Manage cover and metadata').click({ force: true })
    cy.contains('h1', 'Book Metadata')
    cy.url().should('include', '/producer')

    cy.contains('h2', 'Cover page')
    cy.get('label[title="Upload cover image"]').should(
      'have.text',
      'Upload cover image',
    )

    cy.uploadCover('Design1.jpg')

    cy.get('label[title="Alt text for cover image"]').should(
      'have.text',
      'Alt text for cover image',
    )
    cy.get('input[id="coverAlt"]').type('Some alternative text')
    cy.get('input[id="coverAlt"]').should(
      'have.attr',
      'value',
      'Some alternative text',
    )

    cy.log('Replacing an existing dashboard image')
    // Deleting the old one
    cy.get('span[aria-label="delete"]').click({ force: true })
    cy.get('input[id="coverAlt"]').should('not.exist')

    cy.uploadCover('Design2.jpg')
    cy.get('input[id="coverAlt"]').should('exist')
  })

  it('deleting a book', () => {
    cy.addBook('Book 2')
    cy.get('li:nth(1)').should('contain', 'Book 2')
    cy.get('li:nth(1)').find('span[aria-label="more"]').click()
    cy.get('li:nth(1)').find('span[aria-label="delete"]').parent().click()
    cy.contains('Book 2').should('not.exist')
  })

  it('checking that books are sorted in alphanumeric order', () => {
    // Adding 10 books with titles "Book 2" to "Book 11"
    for (let i = 2; i <= 13; i++) {
      cy.addBook(`Book ${i}`)
    }

    // Verifying the ordering - Page 1
    cy.get('li[title="1"]').should(
      'have.attr',
      'aria-label',
      'Page 1 , Current Page',
    )
    cy.get('li[title="2"]').should('have.attr', 'aria-label', 'Go to page 2')

    // Define an array of expected book titles
    const expectedTitles = [
      'Book 1',
      'Book 10',
      'Book 11',
      'Book 12',
      'Book 13',
      'Book 2',
      'Book 3',
      'Book 4',
      'Book 5',
      'Book 6',
      'Book 7',
      'Book 8',
    ]

    // Loop through the expectedTitles array
    expectedTitles.forEach((title, index) => {
      const columnIndex = index
      cy.get(`.ant-card-body:nth(${columnIndex})`).should('contain', title)
    })

    // Page 2
    cy.get('li[title="2"]').click()
    cy.get('li[title="2"]').should(
      'have.attr',
      'aria-label',
      'Page 2 , Current Page',
    )
    cy.get('li[title="1"]').should('have.attr', 'aria-label', 'Go to page 1')

    cy.get('.ant-card-body').should('contain', 'Book 9')
  })
})

Cypress.Commands.add('uploadCover', fileName => {
  cy.get('input[type="file"]')
    .last()
    .should('exist') // Check if the element exists
    .then($input => {
      cy.wrap($input).selectFile(`cypress/fixtures/images/${fileName}`, {
        force: true,
      })
    })
})
