const {
  admin,
  author,
  collaborator1,
  collaborator2,
} = require('../support/credentials')

const authorBook = 'Author Book'

describe('Checking the Preview section', () => {
  before(() => {
    cy.login(admin)
    cy.addBook('Test Book')
    cy.logout()
  })
  beforeEach(() => {
    cy.login(admin)
    cy.goToBook('Test Book')
    cy.goToPreview()
    cy.contains('New export').should('exist')
    cy.contains('You have unsaved changes').should('not.exist')
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
    cy.verifyDefault('format:', 'PDF')
    cy.verifyDefault('size:', 'Digest: 5.5 × 8.5 in | 140 × 216 mm')

    const contentOptions = ['Copyright page', 'Table of contents', 'Title page']

    contentOptions.forEach(option => {
      cy.verifyDefault('content:', `${option}`)
    })

    cy.contains('templates:').should('exist').parent().find('[alt="vanilla"]')

    cy.contains('You have unsaved changes').should('not.exist')

    cy.get('button').contains('Save').parent().should('be.enabled')
    cy.get('button').contains('Download').parent().should('be.enabled')

    // In order to check the carousel for templates is working,
    // checking that the Tenberg template can be selected
    cy.contains('templates:').parent().find('[alt="tenberg"]').click()
    cy.contains('You have unsaved changes').should('be.visible')
  })

  it('creating a new PDF profile export without saving changes', () => {
    // Changing size, content and template options for PDF format
    const sizeOptions = [
      { index: 0, title: 'Digest: 5.5 × 8.5 in | 140 × 216 mm' },
      { index: 1, title: 'US Trade: 6 × 9 in | 152 × 229 mm' },
      { index: 2, title: 'US Letter: 8.5 × 11 in | 216 × 279 mm' },
    ]

    cy.get(`[title="Digest: 5.5 × 8.5 in | 140 × 216 mm"]`).click()

    sizeOptions.forEach(({ index, title }) => {
      cy.get(`[role="option"]:nth(${index})`).click()

      cy.contains('size:')
        .parent()
        .find(`[title="${title}"]`)
        .should('have.text', title)
        .click()
    })

    // Deleting all Content options
    cy.get('.ant-select-clear').click()

    // Changing content options
    cy.contains('Please select').parent().should('exist').click()
    const contentOptions = ['Table of contents', 'Title page', 'Copyright page']

    contentOptions.forEach(option => {
      cy.contains(`${option}`).parent().click()
      cy.get('.ant-select-selector').should('contain', `${option}`)
      /* eslint-disable cypress/no-unnecessary-waiting */
      cy.wait(4000)
    })

    cy.checkTemplates()

    cy.get('span[aria-label="download"]')
      .parent()
      .parent()
      .should('not.be.disabled')

    // Go back to the book and return back here. Verifying that default values are shown.
    cy.contains('Back to book').click()
    cy.url().should('include', '/books')

    cy.goToPreview()

    cy.contains('You have unsaved changes').should('not.exist')
    cy.verifyDefault('format:', 'PDF')
    cy.verifyDefault('size:', 'Digest: 5.5 × 8.5 in | 140 × 216 mm')

    contentOptions.forEach(option => {
      cy.verifyDefault('content:', `${option}`)
    })

    cy.contains('templates:').should('exist').parent().find('[alt="vanilla"]')
  })

  it('creating a new EPUB profile export without saving changes', () => {
    // Changing format option
    cy.contains('format:').parent().find('[title="PDF"]').click()
    cy.get('[title="EPUB"]').should('have.text', 'EPUB').click()

    cy.contains('You have unsaved changes').should('be.visible')

    // Checking ISBN
    cy.contains('ISBN:')
      .should('exist')
      .parent()
      .should('contain', 'No selection')

    // changing content and template options for PDF format
    // Deleting all Content options leaves Table of contents
    cy.get('.ant-select-clear').click()

    // changing content options
    cy.contains('Table of contents').parent().should('exist').click()
    const contentOptions = ['Title page', 'Copyright page']

    contentOptions.forEach(option => {
      cy.contains(`${option}`).parent().click()
      cy.get('.ant-select-selector').should('contain', `${option}`)
      /* eslint-disable cypress/no-unnecessary-waiting */
      cy.wait(3000)
    })

    cy.checkTemplates()

    cy.get('span[aria-label="download"]').parent().parent().should('be.enabled')
  })

  it('saving a new export profile', () => {
    // Changing size and template
    cy.get(`[title="Digest: 5.5 × 8.5 in | 140 × 216 mm"]`).click()
    cy.contains('US Letter: 8.5 × 11 in | 216 × 279 mm').click()
    cy.contains('You have unsaved changes').should('be.visible').click()
    cy.contains('eclypse').click()
    cy.contains('Save').click()

    // Checking Save export modal
    cy.get('.ant-modal-header').should('have.text', 'Save export')
    cy.get('.ant-modal-close-x').click()

    cy.contains('Save').click()
    cy.get('.ant-modal-header').should('have.text', 'Save export')

    cy.get('input[type="text"]').type('PDF Eclypse US')
    cy.contains('button', 'OK').click()
    cy.contains('Profile created').should('exist')
    /* eslint-disable cypress/no-unnecessary-waiting */
    cy.wait(3000)
    cy.get('span[aria-label="edit"]').should('exist')
    cy.contains('Connect to Lulu').should('exist').should('be.enabled')
  })

  it('deleting an export profile', () => {
    // Changing format and template
    cy.get(`[title="PDF"]`).click()
    cy.contains('EPUB').click()
    cy.contains('You have unsaved changes').should('be.visible').click()
    cy.contains('atosh').click()
    cy.contains('Save').click()
    cy.get('.ant-modal-header').should('have.text', 'Save export')

    cy.get('input[type="text"]').type('EPUB atosh')
    cy.contains('button', 'OK').click()
    cy.contains('Profile created').should('exist')
    /* eslint-disable cypress/no-unnecessary-waiting */
    cy.wait(3000)
    cy.contains('Delete').should('exist')

    cy.contains('EPUB atosh').should('exist').click()
    cy.get('#rc_select_0_list_0').should('have.text', 'New export')
    cy.get('[role="listbox"]').contains('EPUB atosh').click()

    cy.contains('Delete').click()
    cy.contains('Success').should('exist')
    cy.contains('Profile has been deleted').should('exist')
  })

  it('renaming an export profile', () => {
    // Creating a new export
    cy.get('.ant-select-clear').click()
    cy.contains('atosh').click()
    cy.contains('You have unsaved changes').should('be.visible').click()
    cy.contains('Save').click()
    cy.get('.ant-modal-header').should('have.text', 'Save export')

    cy.get('input[type="text"]').type('atosh no content')
    cy.contains('button', 'OK').click()
    cy.contains('Profile created').should('exist')

    // Renaming the new export
    cy.get('span[aria-label="edit"]', { timeout: 3000 }).click({ force: true })

    cy.get('.ant-modal-title').should('contain', 'Edit export name')
    // cy.get('input[value="atosh no content"]').last().click()
    cy.get('input[value="atosh no content"]').last().type(' PDF{enter}')
    cy.contains('atosh no content PDF').should('exist')
  })
})

describe('Checking permissions in the Preview page', () => {
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

    cy.login(author)
    cy.addBook(authorBook)
    cy.goToBook(authorBook)
    cy.addMember(collaborator1, 'edit')
    cy.addMember(collaborator2, 'view')
    cy.logout()
  })

  it("checking ADMIN's permissions", () => {
    cy.login(admin)
    cy.log('Admin does NOT have access to the book.')
    cy.contains(authorBook).should('not.exist')

    // cy.goToBook(authorBook)
    // cy.goToPreview()

    // cy.log('ADMIN can choose different format options')
    // cy.chooseFormat('admin')

    // cy.log('ADMIN can save new export')
    // cy.saveExport('admin')

    // // Should admin be able to download?? Permissions in table and irl don't match
    // cy.log('ADMIN can NOT download EPUB')
    // cy.canDownload('yes')

    // cy.log('ADMIN can NOT download PDF')
    // cy.get('span[title="EPUB"]').last().click()
    // cy.contains('PDF').click()
    // cy.canDownload('yes')

    // cy.log('ADMIN can rename an export')
    // cy.canRename('admin')

    // cy.log('ADMIN can NOT connect to Lulu')
    // cy.contains('Connect to Lulu').should('not.exist')

    // cy.log('ADMIN can delete an export')
    // cy.contains('Delete').click()
    // cy.contains('Success').should('exist')
    // cy.contains('Profile has been deleted').should('exist')
  })

  it("checking AUTHOR's permissions", () => {
    cy.login(author)
    cy.goToBook(authorBook)
    cy.goToPreview()

    cy.log('AUTHOR can choose different format options')
    cy.chooseFormat('author')

    cy.log('AUTHOR can save new export')
    cy.saveExport('author')

    cy.log('AUTHOR can download EPUB')
    cy.canDownload('yes')

    cy.log('AUTHOR can download PDF')
    cy.get('span[title="EPUB"]').last().click()
    cy.contains('PDF').click()
    cy.canDownload('yes')

    cy.log('AUTHOR can rename an export')

    cy.canRename('author')

    cy.log('AUTHOR can connect to Lulu')
    cy.contains('Connect to Lulu').should('exist')

    cy.log('AUTHOR can delete an export')
    cy.contains('Delete').click()
    cy.contains('Success').should('exist')
    cy.contains('Profile has been deleted').should('exist')
  })

  it('checking COLLABORATOR with EDIT access permissions', () => {
    cy.login(collaborator1)
    cy.goToBook(authorBook)
    cy.goToPreview()

    cy.log('Collaborators can choose different format options')
    cy.chooseFormat('collaborator')

    cy.log('Collaborators can NOT save new export')
    cy.saveExport('collaborator')

    cy.log('Collaborator with "EDIT" access can download EPUB')
    cy.canDownload('yes')

    cy.log('Collaborator with "EDIT" access can download PDF')
    cy.get('span[title="EPUB"]').last().click()
    cy.contains('PDF').click()
    cy.canDownload('yes')

    cy.log('Collaborators can NOT rename an export')
    // cy.get('span[aria-label="edit"]').should('not.be.visible')
    cy.canRename('collaborator')

    cy.log('Collaborators can NOT connect to Lulu')
    cy.contains('Connect to Lulu').should('not.exist')

    cy.log('Collaborators can NOT delete an export')
    cy.contains('Delete').should('not.exist')
  })

  it('checking COLLABORATOR with VIEW access permissions', () => {
    cy.login(collaborator2)
    cy.goToBook(authorBook)
    cy.goToPreview()

    cy.log('Collaborators can choose different format options')
    cy.chooseFormat('collaborator')

    cy.log('Collaborators can NOT save new export')
    cy.saveExport('collaborator')

    cy.log('Collaborator with "VIEW" access can NOT download EPUB')
    cy.canDownload('disabled')

    cy.log('Collaborator with "VIEW" access can NOT download PDF')
    cy.get('span[title="EPUB"]').last().click()
    cy.contains('PDF').click()
    cy.canDownload('disabled')

    cy.log('Collaborators can NOT rename an export')
    // cy.get('span[aria-label="edit"]').should('not.be.visible')
    cy.canRename('collaborator')

    cy.log('Collaborators can NOT connect to Lulu')
    cy.contains('Connect to Lulu').should('not.exist')

    cy.log('Collaborators can NOT delete an export')
    cy.contains('Delete').should('not.exist')
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

Cypress.Commands.add('verifyDefault', (label, title) => {
  cy.contains(label)
    .should('exist')
    .parent()
    .find(`[title="${title}"]`)
    .should('have.text', title)
})

Cypress.Commands.add('checkTemplates', () => {
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
})

Cypress.Commands.add('chooseFormat', user => {
  cy.get(`[title="PDF"]`).click()
  cy.contains('EPUB').click()
  cy.contains('bikini').click()

  if (user === 'author') {
    cy.contains('You have unsaved changes').should('be.visible')
  } else {
    cy.contains('You have unsaved changes').should('not.exist')
  }
})

Cypress.Commands.add('saveExport', user => {
  if (user === 'author') {
    cy.contains('Save').click()
    cy.get('.ant-modal-header').should('have.text', 'Save export')
    cy.get('input[type="text"]').type(`${user}'s export`)
    cy.contains('button', 'OK').click()
    cy.contains('Profile created').should('exist')
    /* eslint-disable cypress/no-unnecessary-waiting */
    cy.wait(3000)
  } else {
    cy.contains('Save').should('not.exist')
  }
})

Cypress.Commands.add('canDownload', status => {
  if (status === 'disabled') {
    cy.get('span[aria-label="download"]')
      .parent()
      .parent()
      .should('be.disabled')
  } else {
    cy.get('span[aria-label="download"]')
      .parent()
      .parent()
      .should('not.be.disabled')
  }
})

Cypress.Commands.add('canRename', user => {
  if (user === 'author') {
    cy.get('span[aria-label="edit"]').click()
    cy.get('.ant-modal-title').should('contain', 'Edit export name')
    // cy.get(`input[value="${user}'s export"]`).last().click().type(' 1{enter}')
    cy.get(`input[value="${user}'s export"]`).last().type(' 1{enter}')
    cy.contains(`${user}'s export 1`).should('exist')
  } else {
    cy.get('span[aria-label="edit"]').should('not.be.visible')
  }
})
