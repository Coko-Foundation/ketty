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
    cy.goToDashboard()
    cy.goToBook(authorBook)
    cy.goToDashboard()

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
    cy.goToDashboard()

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
    cy.goToDashboard()

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
    cy.goToDashboard()

    cy.log(
      'Collaborators cannot upload thumbnail for the books they have acess to.',
    )
    cy.canUploadThumbnail(authorBook, 'true')
  })

  it("checking ADMIN's permissions in the producer page", () => {
    cy.login(admin)

    cy.log(
      'Admin can create a new component', ///  only in books s/he is owner or collaborator.???
    )
    cy.goToBook(adminBook)
    cy.createChapter()
    cy.log(
      'Admin can edit and use to Wax toolbar', ///  only in books s/he is owner or collaborator.???
    )
    cy.canUseWaxToolbar('admin', 'not.have.attr')

    // Upload a chapter
    // Reorder chapters

    cy.log('Admin can delete unlocked chapters for any book.')
    cy.deleteChapter('Untitled Chapter')

    cy.log('Admin can access Metadata')
    cy.contains('button', 'Book Metadata').click()

    cy.log('Admin can edit Metadata')
    cy.canEditMetadata('admin', 'not.have.attr')

    // Checking for a book that admin isn't owner or collaborator
    // cy.goToDashboard()
    // cy.goToBook(authorBook)
    // cy.createChapter()
    // cy.canUseWaxToolbar('admin', 'not.have.attr')
  })

  it("checking AUTHOR's permissions in the producer page", () => {
    cy.login(author)

    cy.log('Author can create a new component in the book he/she is owner.')
    cy.goToBook(authorBook)
    cy.createChapter()
    cy.log('Author can use Wax toolbar in the book he/she is owner.')
    cy.canUseWaxToolbar('author', 'not.have.attr')

    // Upload a chapter
    // Reorder chapters

    cy.log('Author can delete unlocked chapters in the book he/she is owner.')
    cy.deleteChapter('Untitled Chapter')

    cy.log('Author can access Metadata')
    cy.contains('button', 'Book Metadata').click()

    cy.log('Author can edit Metadata')
    cy.canEditMetadata('author', 'not.have.attr')
  })

  it('checking COLLABORATOR with EDIT access permissions in the producer page', () => {
    cy.login(collaborator1)

    cy.log(
      'COLLABORATOR with EDIT access can create a new component in the book he/she is collaborator.',
    )
    cy.goToBook(authorBook)
    cy.createChapter()
    cy.log(
      'COLLABORATOR with EDIT access can use Wax toolbar in the book he/she is collaborator.',
    )
    cy.canUseWaxToolbar('COLLABORATOR with EDIT access', 'not.have.attr')

    // Upload a chapter
    // Reorder chapters

    cy.log(
      'COLLABORATOR with EDIT access can delete unlocked chapters in the book he/she is collaborator.',
    )
    cy.deleteChapter('Untitled Chapter')

    cy.log(
      'COLLABORATOR with EDIT access can access Metadata in the book he/she is collaborator.',
    )
    cy.contains('button', 'Book Metadata').click()

    cy.log(
      'COLLABORATOR with EDIT access can edit Metadata in the book he/she is collaborator.',
    )
    cy.canEditMetadata('COLLABORATOR with EDIT access', 'not.have.attr')
  })

  it('checking COLLABORATOR with VIEW access permissions in the producer page', () => {
    // Adding a chapter by author in order to check permissions
    cy.login(author)
    cy.goToBook(authorBook)
    cy.createChapter()
    cy.logout()

    cy.login(collaborator2)

    cy.log(
      'COLLABORATOR with VIEW access can NOT create a new component in the book he/she is collaborator.',
    )
    cy.goToBook(authorBook)
    cy.createChapter()
    cy.log(
      'COLLABORATOR with VIEW access can NOT use Wax toolbar in the book he/she is collaborator.',
    )
    cy.canUseWaxToolbar('COLLABORATOR with VIEW access', 'have.attr')

    // Upload a chapter
    // Reorder chapters

    cy.log(
      'COLLABORATOR with VIEW access can NOT delete unlocked chapters in the book he/she is collaborator.',
    )
    cy.contains('Untitled Chapter')
      .parent()
      .parent()
      .find('[data-icon="more"]')
      .should('not.be.enabled')

    cy.log(
      'COLLABORATOR with VIEW access can access Metadata in the book he/she is collaborator.',
    )
    cy.contains('button', 'Book Metadata').click()

    cy.log(
      'COLLABORATOR with VIEW access can NOT edit Metadata in the book he/she is collaborator.',
    )
    cy.canEditMetadata('COLLABORATOR with VIEW access', 'have.attr')
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

Cypress.Commands.add('createChapter', () => {
  cy.get('.anticon-plus').click()
  cy.contains('Untitled Chapter', { timeout: 8000 }).click()
})

Cypress.Commands.add('goToDashboard', () => {
  cy.get("a[href='/dashboard']").last().click()
})

Cypress.Commands.add('canUseWaxToolbar', (user, disabledStatus) => {
  if (disabledStatus === 'not.have.attr') {
    cy.get('.ProseMirror').type(`This is some text by ${user}.`)
    cy.get(`button[title="Undo"]`).click()
    // Checking Redo button
    cy.get(`button[title="Redo"]`).click()
    // Checking Heading styles is clickable
    cy.get('.Dropdown-control').click()
  } else {
    cy.get('.ProseMirror').should('not.be.enabled')
    // Checking Heading styles is not clickable
    cy.get('.Dropdown-control').should('not.be.enabled')
  }

  const buttons = [
    'Undo',
    'Change to Title',
    'Wrap in ordered list',
    'Wrap in bullet list', // Lift out
    'Upload Image',
    'Toggle strong',
    'Toggle emphasis', // Add or remove link
    'Toggle underline',
    'Special Characters',
  ]

  buttons.forEach(buttonTitle => {
    cy.get(`button[title="${buttonTitle}"]`).should(disabledStatus, 'disabled')
  })

  // Everyone can click Find and Replace
  // Something more about Find and replace
  cy.get('button[title="Find And Replace"]').should('have.not.attr', 'disabled')

  // Everyone can click full screen
  cy.get('button[title="Full screen"]').should('have.not.attr', 'disabled')
})

Cypress.Commands.add('deleteChapter', chapterTitle => {
  cy.contains(chapterTitle).parent().parent().find('[data-icon="more"]').click()
  cy.contains('Delete').click()
  cy.contains('You don’t have any chapters yet').should('exist')
})

Cypress.Commands.add('canEditMetadata', (user, disabledStatus) => {
  const metadataFields = [
    '#title',
    '#subtitle',
    '#authors',
    '#isbn',
    '#topPage',
    '#bottomPage',
  ]

  const radioButtons = [
    'input[type="radio"]:nth(0)',
    'input[type="radio"]:nth(1)',
    'input[type="radio"]:nth(2)',
  ]

  metadataFields.forEach(field => {
    cy.get(field).should(disabledStatus, 'disabled')

    if (disabledStatus === 'not.have.attr') {
      // editing Metadata fields
      cy.get(field).type(`edited by ${user}`)
      cy.contains('Save').should('not.have.attr', 'disabled')
    }
  })

  radioButtons.forEach(radioButton => {
    cy.get(radioButton).should(disabledStatus, 'disabled')

    if (disabledStatus === 'not.have.attr') {
      // editing Metadata fields
      cy.get(radioButton).click()
    }
  })
})
