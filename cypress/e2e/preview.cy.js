/* eslint-disable cypress/no-unnecessary-waiting */

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
    cy.goToAdminDashboard()
    const switches = ['dwPDF', 'dwEPUB', 'lulu']
    switches.forEach(switchId => {
      cy.turnSwitchOn(switchId)
      cy.wait(3000)
    })
    cy.logout()
  })
  beforeEach(() => {
    cy.login(admin)
    cy.goToBook('Test Book')
    cy.goToPreview()
  })

  it('checking preview section', () => {
    // the preview is shown as 1 single element and I cannot interact with the components of it
    // so this section checks only the buttons

    // By default, when you log in, the "Show single page" option is selected
    cy.getByData('preview-doublePage-btn')
      .should('exist')
      .should('not.be.checked')
    cy.getByData('preview-singlePage-btn').should('exist').should('be.checked')

    cy.wait(4000)
    cy.getByData('preview-doublePage-btn')
      .parent()
      .siblings()
      .click({ force: true })
    cy.getByData('preview-doublePage-btn').should('be.checked')
    cy.getByData('preview-singlePage-btn').should('not.be.checked')

    // cy.contains('div', '100 %').should('exist')
    cy.getByData('preview-zoomOut-btn').should('not.be.disabled')
    // cy.getByData('preview-zoomIn-btn').should('be.disabled')

    cy.wait(4000)
    cy.getByData('preview-zoomOut-btn').click()
    // cy.contains('div', '90 %', { timeout: 3000 }).should('exist')
    cy.getByData('preview-zoomOut-btn').should('not.be.disabled')
    cy.getByData('preview-zoomIn-btn').should('not.be.disabled')
  })

  it('checking default values for New Preview', () => {
    cy.get('#rc-tabs-0-tab-new')
      .should('have.text', 'New preview')
      .should('have.attr', 'aria-selected', 'true')
    cy.get('#rc-tabs-0-tab-saved')
      .should('have.text', 'Publishing profiles')
      .should('have.attr', 'aria-selected', 'false')
    // cy.verifyDefault('format', 'PDF')
    cy.get(`span[title="PDF"]`).should('exist').should('have.text', 'PDF')

    // cy.verifyDefault('size', 'Digest: 5.5 × 8.5 in | 140 × 216 mm')
    cy.get(`span[title="Digest: 5.5 × 8.5 in | 140 × 216 mm"]`)
      .should('exist')
      .should('have.text', 'Digest: 5.5 × 8.5 in | 140 × 216 mm')

    const contentOptions = ['Copyright page', 'Table of contents', 'Title page']

    contentOptions.forEach(option => {
      cy.verifyDefault('content', `${option}`)
    })

    cy.contains('Templates:').should('exist').parent().find('[alt="vanilla"]')

    cy.getByData('preview-save-btn')
      .should('have.text', 'Save Publishing Profile')
      .should('be.enabled')
    cy.getByData('preview-download-btn')
      .should('have.text', 'Download')
      .should('be.enabled')

    // In order to check the carousel for templates is working,
    // checking that the Tenberg template can be selected
    cy.contains('span[data-test="preview-templateName"]', 'tenberg').click()
  })

  it('creating a new PDF profile without saving the profile', () => {
    // Changing size, content and template options for PDF format
    const sizeOptions = [
      { index: 0, title: 'Digest: 5.5 × 8.5 in | 140 × 216 mm' },
      { index: 1, title: 'US Trade: 6 × 9 in | 152 × 229 mm' },
      { index: 2, title: 'US Letter: 8.5 × 11 in | 216 × 279 mm' },
    ]

    cy.get(`[title="Digest: 5.5 × 8.5 in | 140 × 216 mm"]`).click()

    sizeOptions.forEach(({ index, title }) => {
      cy.get(`[role="option"]:nth(${index})`).click()

      cy.contains('Size:')
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

    cy.getByData('preview-download-btn').should('not.be.disabled')

    // Go back to the book and return back here. Verifying that default values are shown.
    cy.contains('Back to book').click()
    cy.url().should('include', '/books')

    cy.goToPreview()

    cy.contains('You have unsaved changes').should('not.exist')
    // cy.verifyDefault('format', 'PDF')
    // cy.verifyDefault('size', 'Digest: 5.5 × 8.5 in | 140 × 216 mm')
    cy.get(`span[title="PDF"]`).should('exist').should('have.text', 'PDF')
    cy.get(`span[title="Digest: 5.5 × 8.5 in | 140 × 216 mm"]`)
      .should('exist')
      .should('have.text', 'Digest: 5.5 × 8.5 in | 140 × 216 mm')

    contentOptions.forEach(option => {
      cy.verifyDefault('content', `${option}`)
    })

    cy.contains('Templates:').should('exist').parent().find('[alt="vanilla"]')
  })

  it('creating a new EPUB profile export without saving the profile', () => {
    // Changing format option
    cy.wait(5000) // wait for preview to load
    cy.getByData('preview-format-menu').find('[title="PDF"]').click()
    cy.get('[title="EPUB"]').should('have.text', 'EPUB').click()

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
    cy.getByData('preview-download-btn').should('be.enabled')
  })

  it('saving a new publishing profile', () => {
    // Changing size and template
    cy.get(`[title="Digest: 5.5 × 8.5 in | 140 × 216 mm"]`).click()
    cy.contains('US Letter: 8.5 × 11 in | 216 × 279 mm').click()
    cy.contains('eclypse').click()
    cy.getByData('preview-save-btn').click()

    // Checking Save Publishing Profile modal
    cy.get('.ant-modal-header').should('have.text', 'Save Publishing Profile')
    cy.get('.ant-modal-close-x').click()

    cy.getByData('preview-save-btn').click()
    cy.get('.ant-modal-header').should('have.text', 'Save Publishing Profile')

    cy.getByData('preview-exportName-input').type('PDF Eclypse US')
    cy.contains('button', 'OK').click()

    cy.get('#rc-tabs-0-tab-new')
      .should('have.text', 'New preview')
      .should('have.attr', 'aria-selected', 'false')
    cy.get('#rc-tabs-0-tab-saved')
      .should('have.text', 'Publishing profiles')
      .should('have.attr', 'aria-selected', 'true')

    cy.contains('label', 'Choose a profile').should('exist')
    cy.get('[title="PDF Eclypse US"]').should('exist')
    cy.getByData('preview-save-btn')
      .should('have.text', 'Update')
      .should('be.disabled')
    cy.getByData('preview-delete-btn')
      .should('have.text', 'Delete')
      .should('not.be.disabled')

    /* eslint-disable cypress/no-unnecessary-waiting */
    // cy.wait(3000)
    cy.contains('h3', 'Lulu integration:')
    cy.getByData('preview-connectLulu-btn')
      .should('have.text', 'Connect to Lulu')
      .should('exist')
      .should('be.enabled')

    cy.contains('h3', 'Profile information:')
    cy.contains('div', 'Name').should('exist')
    cy.contains('span', 'PDF Eclypse US').should('exist')
    cy.get('span[aria-label="edit"]').should('exist')
    cy.contains('div', 'Last updated:').should('exist')
    cy.contains('div', 'Format:').should('exist')
    cy.contains('span', 'PDF').should('exist')
    cy.contains('div', 'Size').should('exist')
    cy.contains('span', 'US Letter: 8.5 × 11 in | 216 × 279 mm').should('exist')
  })

  it('deleting an export profile', () => {
    // Changing format and template
    cy.wait(5000) // wait for preview to load
    cy.getByData('preview-format-menu').find('[title="PDF"]').click()
    cy.get('[title="EPUB"]').should('have.text', 'EPUB').click()
    cy.contains('atosh').click()
    cy.getByData('preview-save-btn').click()
    cy.get('.ant-modal-header').should('have.text', 'Save Publishing Profile')

    cy.getByData('preview-exportName-input').type('EPUB atosh')
    cy.contains('button', 'OK').click()
    cy.get('#rc-tabs-0-tab-saved')
      .should('have.text', 'Publishing profiles')
      .should('have.attr', 'aria-selected', 'true')
    /* eslint-disable cypress/no-unnecessary-waiting */
    cy.wait(3000)
    cy.getByData('preview-delete-btn').should('exist')

    cy.contains('EPUB atosh').should('exist').click()
    cy.get('[role="listbox"]').contains('EPUB atosh').click()

    cy.getByData('preview-delete-btn').click()
    cy.contains('Success').should('exist')
    cy.contains('Profile has been deleted').should('exist')
  })

  it('renaming an export profile', () => {
    // Creating a new export
    cy.get('.ant-select-clear').click()
    cy.contains('atosh').click()
    cy.getByData('preview-save-btn').click()
    cy.get('.ant-modal-header').should('have.text', 'Save Publishing Profile')

    cy.getByData('preview-exportName-input').type('atosh no content')
    cy.contains('button', 'OK').click()
    cy.get('#rc-tabs-0-tab-saved')
      .should('have.text', 'Publishing profiles')
      .should('have.attr', 'aria-selected', 'true')

    // Renaming the new export
    cy.get('span[aria-label="edit"]', { timeout: 3000 }).click({ force: true })

    cy.get('.ant-modal-title').should('contain', 'Edit profile name')
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
    cy.reload()
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
    // cy.saveProfile('admin')

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
    cy.saveProfile('author')

    cy.log('AUTHOR can download EPUB')
    cy.canDownload('yes')

    // cy.log('AUTHOR can download PDF')
    // cy.get('span[title="EPUB"]').last().click()
    // cy.contains('PDF').click()
    // cy.canDownload('yes')

    cy.log('AUTHOR can rename an export')

    cy.canRename('author')

    cy.log('AUTHOR can connect to Lulu')
    cy.getByData('preview-connectLulu-btn')
      .should('have.text', 'Connect to Lulu')
      .should('exist')

    cy.log('AUTHOR can delete an export')
    cy.getByData('preview-delete-btn').click()
    cy.contains('Success').should('exist')
    cy.contains('Profile has been deleted').should('exist')
  })

  it('checking COLLABORATOR with EDIT access permissions', () => {
    cy.login(collaborator1)
    cy.goToBook(authorBook)
    cy.goToPreview()

    cy.log('Collaborators can choose different format options')
    cy.chooseFormat('collaborator')

    cy.log('Collaborators with EDIT access can save new export')
    cy.saveProfile('collaborator1')

    cy.log('Collaborator with "EDIT" access can download EPUB')
    cy.canDownload('yes')

    // cy.log('Collaborator with "EDIT" access can download PDF')
    // cy.get('span[title="EPUB"]').last().click()
    // cy.contains('PDF').click()
    // cy.canDownload('yes')

    cy.log('Collaborator with EDIT access can rename an export')
    cy.canRename('collaborator1')

    cy.log('Collaborators can NOT connect to Lulu')
    cy.getByData('preview-connectLulu-btn').should('not.exist')

    cy.log('Collaborator with EDIT access can delete an export')
    cy.getByData('preview-delete-btn').should('exist').click()
    cy.contains('Success').should('exist')
  })

  it('checking COLLABORATOR with VIEW access permissions', () => {
    cy.login(collaborator2)
    cy.goToBook(authorBook)
    cy.goToPreview()

    cy.log('Collaborators can choose different format options')
    cy.chooseFormat('collaborator')

    cy.log('Collaborator with VIEW can NOT save new export')
    cy.saveProfile('collaborator2')

    cy.log('Collaborator with "VIEW" access can NOT download EPUB')
    cy.canDownload('disabled')

    cy.log('Collaborator with "VIEW" access can NOT download PDF')
    cy.get('span[title="EPUB"]').last().click()
    cy.contains('PDF').click()
    cy.canDownload('disabled')

    cy.log('Collaborator with VIEW access can NOT rename an export')
    // cy.get('span[aria-label="edit"]').should('not.be.visible')
    cy.canRename('collaborator2')

    cy.log('Collaborators can NOT connect to Lulu')
    cy.getByData('preview-connectLulu-btn').should('not.exist')

    cy.log('Collaborator with VIEW access can NOT delete an export')
    cy.getByData('preview-delete-btn').should('not.exist')
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
  cy.getByData(`preview-${label}`)
    .should('exist')
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
    cy.contains('span[data-test="preview-templateName"]', `${title}`).click()
  })
})

Cypress.Commands.add('chooseFormat', user => {
  cy.wait(5000) // wait for preview to load
  cy.getByData('preview-format-menu').find('[title="PDF"]').click()
  cy.get('[title="EPUB"]').should('have.text', 'EPUB').click()
  cy.contains('bikini').click()

  if (user === 'author') {
    cy.getByData('preview-save-btn').should('not.be.disabled')
  } else {
    cy.getByData('preview-save-btn').should('be.disabled')
  }
})

Cypress.Commands.add('saveProfile', user => {
  if (user === 'author' || user === 'collaborator1') {
    cy.getByData('preview-save-btn').click()
    cy.get('.ant-modal-header').should('have.text', 'Save Publishing Profile')
    cy.getByData('preview-exportName-input').type(`${user}'s export`)
    cy.contains('button', 'OK').click()
    cy.get('#rc-tabs-0-tab-saved')
      .should('have.text', 'Publishing profiles')
      .should('have.attr', 'aria-selected', 'true')
    /* eslint-disable cypress/no-unnecessary-waiting */
    cy.wait(3000)
  } else {
    cy.getByData('preview-save-btn').should('be.disabled')
  }
})

Cypress.Commands.add('canDownload', status => {
  if (status === 'disabled') {
    cy.getByData('preview-download-btn').should('be.disabled')
  } else {
    cy.getByData('preview-download-btn').should('not.be.disabled')
  }
})

Cypress.Commands.add('canRename', user => {
  if (user === 'author' || user === 'collaborator1') {
    cy.get('span[aria-label="edit"]').click()
    cy.get('.ant-modal-title').should('contain', 'Edit profile name')
    // cy.get(`input[value="${user}'s export"]`).last().click().type(' 1{enter}')
    cy.get(`input[value="${user}'s export"]`).last().type(' 1{enter}')
    cy.contains(`${user}'s export 1`).should('exist')
  } else {
    cy.get('span[aria-label="edit"]').should('not.exist')
  }
})
