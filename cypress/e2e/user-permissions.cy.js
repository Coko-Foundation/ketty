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
    cy.exec(
      'docker exec kdk_server_1 node ./scripts/seeds/createVerifiedUser.js author.1@example.com Author 1 author.1',
    )
    cy.log('Author 1 is created.')
    cy.exec(
      'docker exec kdk_server_1 node ./scripts/seeds/createVerifiedUser.js collaborator.1@example.com Collaborator 1 collaborator.1',
    )
    cy.log('Collaborator 1 is created.')
    cy.exec(
      'docker exec kdk_server_1 node ./scripts/seeds/createVerifiedUser.js collaborator.2@example.com Collaborator 2 collaborator.2',
    )
    cy.log('Collaborator 2 is created.')
    // cy.signup(author)
    // cy.signup(collaborator1)
    // cy.signup(collaborator2)
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

  context('Checking permissions in the dashboard', () => {
    it("checking ADMIN's permissions", () => {
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

    it("checking AUTHOR's permissions", () => {
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

    it('checking COLLABORATOR with EDIT access permissions', () => {
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

    it('checking COLLABORATOR with VIEW access permissions', () => {
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
  })

  context('Checking permissions in the producer page', () => {
    it("checking ADMIN's permissions in the producer page", () => {
      cy.login(admin)

      cy.log('Admin can create a new component in any book')
      cy.goToBook(adminBook)
      cy.createUntitledChapter()
      cy.log('Admin can edit and use to Wax toolbar in any book')
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
      cy.goToDashboard()
      cy.goToBook(authorBook)
      cy.reload()
      cy.createUntitledChapter()
      cy.canUseWaxToolbar('admin', 'not.have.attr')
      cy.deleteChapter('Untitled Chapter')

      cy.contains('button', 'Book Metadata').click()
      cy.canEditMetadata('admin', 'not.have.attr')

      cy.log("Admin can see people's access in any book.")
      cy.contains('button', 'Share').click()
      cy.canSeeAccess()

      cy.log("Admin can change members's access in any book.")
      cy.canChangeAccess('yes')
    })

    it("checking AUTHOR's permissions in the producer page", () => {
      cy.login(author)

      cy.log('Author can create a new component in the book he/she is owner.')
      cy.goToBook(authorBook)
      cy.createUntitledChapter()
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

      cy.log("Author can see people's access in the book he/she is owner.")
      cy.contains('button', 'Share').click()
      cy.canSeeAccess()

      cy.log("Author can change members's access in the book he/she is owner.")
      cy.canChangeAccess('yes')
    })

    it('checking COLLABORATOR with EDIT access permissions in the producer page', () => {
      cy.login(collaborator1)

      cy.log(
        'COLLABORATOR with EDIT access can create a new component in the book he/she is collaborator.',
      )
      cy.goToBook(authorBook)
      cy.createUntitledChapter()
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

      cy.log(
        "COLLABORATORS can see people's access in the book he/she is collaborator.",
      )
      cy.contains('button', 'Share').click()
      cy.canSeeAccess()

      cy.log(
        "COLLABORATORS can NOT change members's access in the book he/she is collaborator..",
      )

      cy.canChangeAccess('no')
    })

    it('checking COLLABORATOR with VIEW access permissions in the producer page', () => {
      // Adding a chapter by author in order to check permissions
      cy.login(author)
      cy.goToBook(authorBook)
      cy.createUntitledChapter()
      cy.logout()

      cy.login(collaborator2)

      cy.log(
        'COLLABORATOR with VIEW access can NOT create a new component in the book he/she is collaborator.',
      )
      cy.goToBook(authorBook)
      cy.createUntitledChapter()
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

      cy.log(
        "COLLABORATORS can see people's access in the book he/she is collaborator.",
      )
      cy.contains('button', 'Share').click()
      cy.canSeeAccess()

      cy.log(
        "COLLABORATORS can NOT change members's access in the book he/she is collaborator..",
      )

      cy.canChangeAccess('no')
    })
  })

  context(
    'Checking permissions for reordering chapters by drag and drop',
    () => {
      before(() => {
        cy.login(author)
        cy.goToBook(authorBook)
        const chapters = ['Chapter 1', 'Chapter 2', 'Chapter 3']
        chapters.forEach(chapter => {
          cy.createChapter(chapter)
        })
        cy.logout()
      })

      it('ADMIN can reorder chapters', () => {
        cy.login(admin)
        cy.goToBook(authorBook)
        cy.reload()

        cy.canReorderChapters()
      })

      it('AUTHOR can reorder chapters', () => {
        cy.login(author)
        cy.goToBook(authorBook)
        cy.canReorderChapters()
      })

      it('COLLABORATOR with EDIT access can reorder chapters', () => {
        cy.login(collaborator1)
        cy.goToBook(authorBook)
        cy.canReorderChapters()
      })

      it('COLLABORATOR with VIEW access can NOT reorder chapters', () => {
        cy.login(collaborator2)
        cy.goToBook(authorBook)
        cy.reload()
        cy.get('.ant-list-items > :nth-child(1)').should('contain', 'Chapter 1')
        cy.contains('Chapter 1').dragAndDrop(
          ':nth-child(1) > .ChapterItem__Chapter-sc-qfks8y-0 > .anticon-holder',
          'div:nth(59)',
        )
        cy.get('.ant-list-items > :nth-child(1)').should('contain', 'Chapter 1')
      })
    },
  )
})

Cypress.Commands.add('createImportedBook', bookTitle => {
  cy.location('pathname').should('equal', '/dashboard')
  cy.get('button:nth(3)').should('have.text', 'Import your files').click()
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
    cy.get('[aria-controls="block-level-options"]').click()
    cy.get('#block-level-options > :nth-child(5)').click()
  } else {
    cy.get('.ProseMirror').should('not.be.enabled')
    // Checking Heading styles is not clickable
    cy.get('[aria-controls="block-level-options"]').should('not.be.enabled')
  }

  const buttons = [
    'Undo',
    'Wrap in ordered list',
    'Wrap in bullet list',
    'Lift out of enclosing block', // Lift out
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
  cy.get('button[title="Find And Replace"]').click()
  // Something more about Find and replace
  cy.get('button[title="Find And Replace"]').should('have.not.attr', 'disabled')
  cy.get('button[title="Find And Replace"]').click()
  // Not everyone can click more though: check manually

  // Everyone can click full screen
  cy.get('button[title="Full screen"]').should('have.not.attr', 'disabled')
})

Cypress.Commands.add('deleteChapter', chapterTitle => {
  cy.url().should('include', '/producer')
  cy.contains(chapterTitle).parent().parent().find('[data-icon="more"]').click()
  cy.contains('Delete').click()
  cy.contains('You don’t have any chapters yet').should('exist')
})

Cypress.Commands.add('canEditMetadata', (user, disabledStatus) => {
  const metadataFields = [
    '#title',
    '#subtitle',
    '#authors',
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

  // Adding ISBN
  cy.contains('button', 'Add ISBN').should(disabledStatus, 'disabled')

  if (disabledStatus === 'not.have.attr') {
    // editing Metadata fields
    cy.contains('button', 'Add ISBN').click()
  }

  cy.contains('Close').click()
})

Cypress.Commands.add('canSeeAccess', () => {
  const members = [
    { name: 'Author 1', initials: 'A1', access: 'Owner' },
    { name: 'Collaborator 1', initials: 'C1', access: 'Can edit' },
    { name: 'Collaborator 2', initials: 'C2', access: 'Can view' },
  ]

  members.forEach(({ name, initials, access }) => {
    cy.contains(name).parent().should('contain', initials, access)
  })
})

Cypress.Commands.add('canChangeAccess', status => {
  if (status === 'yes') {
    // Changing Collaborator 2 access to Can edit
    cy.contains('Collaborator 2').parent().parent().find('.ant-select').click()
    cy.get('[role="option"]:nth(1)').should('have.text', 'Can edit').click()
    cy.contains('Collaborator 2')
      .parent()
      .parent()
      .should('contain', 'Can edit')
    // Removing access of Collaborator 2
    cy.contains('Collaborator 2').parent().parent().find('.ant-select').click()
    cy.get('[role="option"]:nth(2)')
      .should('have.text', 'Remove access')
      .click()

    cy.log(`Author and admin can give members's access.`)

    // Adding Collaborator 2 again with View access
    cy.get('.ant-select-selection-overflow').type(collaborator2.email)
    cy.get('div[role="option"]').click()
    cy.get('button[type="submit"]').click()
  } else {
    cy.get('input[type="search"]:nth(2)').should('have.attr', 'disabled')

    cy.log(
      "COLLABORATORS can NOT give members's access in the book he/she is collaborator.",
    )

    cy.get('input[type="search"]:nth(0)').should('have.attr', 'disabled')
    cy.get('button[type="submit"]').should('be.disabled')
  }
})

Cypress.Commands.add('canReorderChapters', status => {
  cy.contains('Chapter 1').dragAndDrop(
    ':nth-child(1) > .ChapterItem__Chapter-sc-qfks8y-0 > .anticon-holder',
    'div:nth(59)',
  )

  cy.get('.ant-list-items > :nth-child(1)').should('contain', 'Chapter 2')
  cy.get('.ant-list-items > :nth-child(2)').should('contain', 'Chapter 3')
  cy.get('.ant-list-items > :nth-child(3)').should('contain', 'Chapter 1')

  cy.log('Chapter 1 was moved below chapter 3')

  cy.contains('Chapter 2').dragAndDrop(
    ':nth-child(1) > .ChapterItem__Chapter-sc-qfks8y-0 > .anticon-holder',
    'div:nth(59)',
  )
  cy.get('.ant-list-items > :nth-child(1)').should('contain', 'Chapter 3')
  cy.get('.ant-list-items > :nth-child(2)').should('contain', 'Chapter 1')
  cy.get('.ant-list-items > :nth-child(3)').should('contain', 'Chapter 2')

  cy.log('Chapter 2 was moved below chapter 1')

  cy.contains('Chapter 3').dragAndDrop(
    ':nth-child(1) > .ChapterItem__Chapter-sc-qfks8y-0 > .anticon-holder',
    'div:nth(59)',
  )
  cy.get('.ant-list-items > :nth-child(1)').should('contain', 'Chapter 1')
  cy.get('.ant-list-items > :nth-child(2)').should('contain', 'Chapter 2')
  cy.get('.ant-list-items > :nth-child(3)').should('contain', 'Chapter 3')
})
