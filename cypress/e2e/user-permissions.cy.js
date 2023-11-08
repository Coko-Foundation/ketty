/* eslint-disable jest/expect-expect */
const {
  admin,
  author,
  collaborator1,
  collaborator2,
} = require('../support/credentials')

const adminBook = 'Admin Book'
const authorBook = 'Author Book'

describe('Checking permissions for dashboard', () => {
  before(() => {
    cy.signup(author)
    cy.signup(collaborator1)
    cy.signup(collaborator2)
    cy.login(admin)
    cy.log('Admin can create a book')
    cy.addBook(adminBook)
    cy.logout()
    cy.login(author)
    cy.log('A new user can create a book')
    cy.addBook(authorBook)
    cy.goToBook(authorBook)
    cy.addMember(collaborator1, 'edit')
    cy.addMember(collaborator2, 'view')
    cy.logout()
  })
  beforeEach(() => {})

  it("checking ADMIN's permissions in the dashboard", () => {
    cy.login(admin)

    cy.log('Admin can import files when creating a new book.')
    cy.createImportedBook('Admin imported book')

    cy.log('Admin can see all books.')
    cy.contains(adminBook).should('exist')
    cy.contains(authorBook).should('exist')

    cy.log('Admin can delete all books')
    cy.canDeleteBook(adminBook, 'false')
    cy.canDeleteBook(authorBook, 'false')

    cy.log('Admin can go to the producer page for any book.')
    cy.goToBook(adminBook)
    cy.get("a[href='/dashboard']").last().click()
    cy.goToBook(authorBook)
    cy.get("a[href='/dashboard']").last().click()

    cy.log('Admin can upload thumbnail for all books')
    cy.canUploadThumbnail(adminBook, 'false')
    cy.canUploadThumbnail(authorBook, 'false')
  })

  it("checking AUTHOR's permissions in the dashboard", () => {
    cy.login(author)

    cy.log('Author can import files when creating a new book.')
    cy.createImportedBook('Author imported book')

    cy.log('Author can see only the books he/she has access to.')
    cy.contains(adminBook).should('not.exist')
    cy.contains(authorBook).should('exist')

    cy.log('Author can delete his/her book')
    cy.canDeleteBook(authorBook, 'false')

    cy.log('Author can go to the producer page for his/her book.')
    cy.goToBook(authorBook)
    cy.get("a[href='/dashboard']").last().click()

    cy.log('Author can upload thumbnail for his/her book.')
    cy.canUploadThumbnail(authorBook, 'false')
  })

  it('checking COLLABORATOR with EDIT access permissions in the dashboard', () => {
    cy.login(collaborator1)

    cy.log('Collaborator can import files when creating a new book.')
    cy.createImportedBook("Collaborator's imported book")

    cy.log('Collaborator can see only the books he/she has access to.')
    cy.contains(adminBook).should('not.exist')
    cy.contains(authorBook).should('exist')

    cy.log('Collaborators cannot delete books they have access to.')
    cy.canDeleteBook(authorBook, 'true')

    cy.log(
      'Collaborators can go to the producer page of the books they have access to.',
    )
    cy.goToBook(authorBook)
    cy.get("a[href='/dashboard']").last().click()

    cy.log(
      'Collaborators cannot upload thumbnail for the books they have acess to.',
    )
    cy.canUploadThumbnail(authorBook, 'true')
  })

  it('checking COLLABORATOR with VIEW access permissions in the dashboard', () => {
    cy.login(collaborator2)

    cy.log('Collaborator can see only the books he/she has access to.')
    cy.contains(adminBook).should('not.exist')
    cy.contains(authorBook).should('exist')

    cy.log('Collaborators cannot delete books they have access to.')
    cy.canDeleteBook(authorBook, 'true')

    cy.log(
      'Collaborators can go to the producer page of the books they have access to.',
    )
    cy.goToBook(authorBook)
    cy.get("a[href='/dashboard']").last().click()

    cy.log(
      'Collaborators cannot upload thumbnail for the books they have acess to.',
    )
    cy.canUploadThumbnail(authorBook, 'true')
  })
})

Cypress.Commands.add('addMember', (collaborator, access) => {
  cy.contains('button', 'Book Members').click()
  cy.get('.ant-select-selection-overflow').type(collaborator.email)
  cy.get('div[role="option"]').click()

  cy.get('.ant-select-selection-overflow').should(
    'contain',
    collaborator.name,
    collaborator.surname,
  )

  if (access === 'edit') {
    // Default permission is Can view
    cy.contains('Can view').click()

    // Changing permission to Can edit
    cy.contains('Can edit').click()
    cy.contains('Add user').click()
  } else if (access === 'view') {
    cy.contains('Add user').click()
  }

  cy.get('.ant-modal-close').click()
})

Cypress.Commands.add('createImportedBook', bookTitle => {
  cy.location('pathname').should('equal', '/dashboard')
  cy.get('button:nth(2)').should('have.text', 'Import your files').click()
  cy.get('input[type="file"]').selectFile(
    'cypress/fixtures/docs/test_document.docx',
    { force: true },
  )
  cy.contains('Continue').click()
  cy.get('#bookTitle').type(bookTitle)
  cy.get('form').find('button').should('have.text', 'Continue').click()

  cy.contains('Book Metadata')
  cy.contains(bookTitle)
  cy.get("a[href='/dashboard']").last().click()
  cy.location('pathname').should('equal', '/dashboard')
  // Confirm that book exists in the dashboard'
  cy.get('.ant-card-body').contains(bookTitle)
})

Cypress.Commands.add('canDeleteBook', (bookTitle, ariaDisAttr) => {
  cy.location('pathname').should('equal', '/dashboard')
  cy.contains(bookTitle).siblings().find('[data-icon="more"]').click()
  cy.contains('Delete book')
    .parent()
    .parent()
    .should('have.attr', 'aria-disabled', ariaDisAttr)
})

Cypress.Commands.add('canUploadThumbnail', (bookTitle, ariaDisAttr) => {
  cy.location('pathname').should('equal', '/dashboard')
  cy.contains(bookTitle).siblings().find('[data-icon="more"]').click()
  cy.contains('Upload book placeholder image')
    .parent()
    .parent()
    .parent()
    .should('have.attr', 'aria-disabled', ariaDisAttr)
})
