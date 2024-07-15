/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable-line cypress/unsafe-to-chain-command */

const {
  admin,
  collaborator1,
  collaborator2,
} = require('../support/credentials')

const testBook = 'Test Book'

describe('Checking default state in Book Settings modal', () => {
  before(() => {
    cy.exec(
      'docker exec kdk_server_1 node ./scripts/seeds/createVerifiedUser.js collaborator.1@example.com Collaborator 1 collaborator.1',
    )
    cy.log('Collaborator 1 is created.')
    cy.exec(
      'docker exec kdk_server_1 node ./scripts/seeds/createVerifiedUser.js collaborator.2@example.com Collaborator 2 collaborator.2',
    )
    cy.log('Collaborator 2 is created.')
    cy.login(admin)
    cy.addBook(testBook)
    cy.goToBook(testBook)
    cy.addMember(collaborator1, 'edit')
    cy.reload()
    cy.addMember(collaborator2, 'view')
    cy.logout()
  })

  it('KB in Book Settings modal', () => {
    cy.login(admin)
    cy.goToBook(testBook)
    cy.openBookSettings()

    cy.contains('AI writing prompt use').should('exist')
    cy.verifySwitch(0, 'disabled')

    cy.contains('AI Book Designer (Beta)').should('exist')
    cy.verifySwitch(1, 'disabled')

    cy.contains('Knowledge Base').should('exist')
    cy.contains(
      'Users with edit access to this book can create and query a knowledge base. Requires AI writing prompts and free text prompts to be on.',
    ).should('exist')
    cy.verifySwitch(2, 'disabled')

    cy.contains('button', 'Save').should('have.attr', 'type', 'submit')
    cy.contains('button', 'Cancel').should('have.attr', 'type', 'reset')
  })

  it('checking that KB requires AI writing prompt use to be enabled too', () => {
    cy.login(admin)
    cy.goToBook(testBook)
    cy.openBookSettings()

    // Enabling KB
    cy.verifySwitch(0, 'disabled')
    cy.contains('Free-text writing prompts').should('not.exist')
    cy.toogleSwitch(2) // Knowledge Base
    cy.verifySwitch(4, 'enabled') // Knowledge Base

    // AI writing prompt is enabled
    cy.verifySwitch(0, 'enabled') // AI writing prompt use
    cy.verifySwitch(1, 'enabled') // Free-text writing prompts

    // Disabling Free-text writing prompts
    cy.toogleSwitch(1)
    cy.verifySwitch(1, 'disabled') // Free-text writing prompts

    // KB gets disabled automatically
    cy.verifySwitch(4, 'disabled') // Free-text writing prompts
  })
})

describe('Knowledge Base is enabled', () => {
  before(() => {
    cy.login(admin)
    cy.goToBook(testBook)

    // Enabling Knowledge Base
    cy.openBookSettings()
    cy.verifySwitch(2, 'disabled')
    cy.toogleSwitch(2)
    cy.verifySwitch(4, 'enabled')
    cy.contains('button', 'Save').click()
    cy.contains('Book settings').should('not.exist', { timeout: 6000 })

    cy.logout()
  })

  it('Checking KB button and page', () => {
    cy.login(admin)
    cy.goToBook(testBook)

    cy.wait(6000)
    cy.get('.ProseMirror', { timeout: 10000 }).type(
      'Add a paragraph{selectall}',
    )
    cy.get('button[title="Toggle Ai"]').should('not.be.disabled')
    cy.get('button[title="Toggle Ai"]').click({ force: true })

    cy.get('input[id="askAiInput"]')
      .should('have.attr', 'placeholder')
      .and('eq', 'How can I help you? Type your prompt here.')

    // Checking 'Ask knowledge base' button in AI assistant
    cy.get('button[title="Ask knowledge base (enabled)"]').should('exist')

    cy.get('button[title="Ask knowledge base (enabled)"]').click()
    cy.get('button[title="Ask knowledge base (disabled)"]').should('exist')

    cy.get('button[title="Ask knowledge base (disabled)"]').click()
    cy.get('button[title="Ask knowledge base (enabled)"]').should('exist')

    cy.contains('Knowledge base').should('exist')
    cy.navigateToKnowledgeBase()

    // Checking the buttons in KB page
    cy.contains('h2', 'Knowledge Base').should('exist')
    cy.contains('span', 'Select all').should('exist')
    cy.get('input[type="checkbox"]').should('have.attr', 'disabled')
    cy.get('input[aria-label="Upload files"]')
    cy.contains('Add Files').should('exist')
    cy.get('button[aria-label="Upload pending files"]').should(
      'have.attr',
      'disabled',
    )
    cy.contains('Upload All').should('exist')
    cy.get('button[aria-label="Delete selected files"]').should(
      'have.attr',
      'disabled',
    )
    cy.contains('p', 'Selected: ').should('exist')
    cy.contains('p', '0 / 0').should('exist')

    cy.contains('Drop and upload your documents to the knowledge base')
  })

  it('Adding and removing individual files', () => {
    cy.login(admin)
    cy.goToBook(testBook)
    cy.navigateToKnowledgeBase()

    cy.contains(
      'p',
      'Drop and upload your documents to the knowledge base',
    ).should('exist')

    cy.uploadFile('docs/chapter1_test.docx')

    // Delete pending file
    cy.get('[aria-label="Remove"]').click()

    // Upload individual file
    cy.uploadFile('docs/chapter1_test.docx')
    cy.get('[aria-label="Upload"]').click()
    cy.get('li[title="chapter1_test"]').should('exist')
    cy.get('button[title="Upload"]').should('not.exist')
    cy.get('button[aria-label="Upload pending files"]').should(
      'have.attr',
      'disabled',
    )
    cy.get('button[aria-label="Delete selected files"]').should(
      'have.attr',
      'disabled',
    )
    // Delete individual file
    cy.get('button[title="Delete file"]').should('exist').click()
    cy.get('li[title="chapter1_test"]').should('not.exist')
  })

  it('Adding and removing files in bulk', () => {
    cy.login(admin)
    cy.goToBook(testBook)
    cy.navigateToKnowledgeBase()

    cy.contains(
      'p',
      'Drop and upload your documents to the knowledge base',
    ).should('exist')
    cy.canUseKB()

    // Delete files in bulk
    cy.get('input[type="checkbox"]').first().click()
    cy.contains('p', 'Selected: 3 / 3').should('exist')
    cy.get('button[aria-label="Delete selected files"]').click()
    cy.get('li[title="chapter1_test"]').should('not.exist')
    cy.get('li[title="chapter2_test"]').should('not.exist')
    cy.get('li[title="chapter3_test"]').should('not.exist')
  })

  it('Checking file types that can be uploaded', () => {
    cy.login(admin)
    cy.goToBook(testBook)
    cy.contains('Knowledge base').should('exist')
    cy.navigateToKnowledgeBase()

    cy.contains(
      'p',
      'Drop and upload your documents to the knowledge base',
    ).should('exist')

    // Upload multiple files
    const filesToUpload = [
      'document1.md',
      'test_document.pdf',
      'test1.xls',
      'test2.xlsm',
      'test3.xlt',
      'test4.xlsx',
      'test5.xlsb',
    ]

    filesToUpload.forEach(file => {
      cy.uploadFile(`files/${file}`)
    })

    // Upload pending files in bulk
    cy.get('button[aria-label="Upload pending files"]').click()

    // Check if files were uploaded successfully
    const filesToCheck = ['document1', 'test_document', 'test1']

    filesToCheck.forEach(file => {
      cy.get(`li[title="${file}"]`, { timeout: 8000 }).should('exist')
    })
  })
  it('Checking file names that are supported', () => {
    cy.login(admin)
    cy.goToBook(testBook)
    cy.contains('Knowledge base').should('exist')
    cy.navigateToKnowledgeBase()

    // Upload multiple files
    const filesWithOddNames = [
      'name with spaces.pdf',
      'name_has-special@characters#test!2024$.pdf',
    ]

    filesWithOddNames.forEach(file => {
      cy.uploadFile(`files/${file}`)
    })

    // Upload pending files in bulk
    cy.get('button[aria-label="Upload pending files"]').click()

    // Check if files were uploaded successfully
    const uploadedFilesWithOddNames = [
      'name with spaces',
      'name_has-special@characters#test!2024$',
    ]

    uploadedFilesWithOddNames.forEach(file => {
      cy.get(`li[title="${file}"]`, { timeout: 8000 }).should('exist')
    })

    // verifying versioning
    // Upload again
    cy.uploadFile(`files/name with spaces.pdf`)
    cy.get('button[aria-label="Upload pending files"]').click()
    cy.get(`li[title="name with spaces(1)"]`, { timeout: 8000 }).should('exist')
  })

  context("checking users' permissions in the modal", () => {
    it('COLLABORATOR with EDIT access can access Knowledge Base', () => {
      cy.login(collaborator1)
      cy.goToBook(testBook)
      cy.contains('Knowledge base').should('exist')
      cy.navigateToKnowledgeBase()

      cy.canUseKB()
      // Delete files in bulk
      cy.get('input[type="checkbox"]').first().click()
      cy.get('button[aria-label="Delete selected files"]').click()
      cy.get('li[title="chapter1_test"]').should('not.exist')
      cy.get('li[title="chapter2_test"]').should('not.exist')
      cy.get('li[title="chapter3_test"]').should('not.exist')
    })

    it('COLLABORATOR with VIEW access can NOT access access Knowledge Base', () => {
      cy.login(collaborator2)
      cy.goToBook(testBook)
      cy.contains('access Knowledge Base)').should('not.exist')
    })
  })
})

Cypress.Commands.add('openBookSettings', () => {
  cy.get('[aria-label="Book settings"]').click()
  cy.contains('Book settings').should('exist')
})

Cypress.Commands.add('verifySwitch', (switchIndex, status) => {
  const expectedValue = status === 'enabled' ? 'true' : 'false'

  cy.get('[role="switch"]')
    .eq(switchIndex)
    .should('have.attr', 'aria-checked', expectedValue)
})

Cypress.Commands.add('toogleSwitch', switchIndex => {
  cy.get(`[role="switch"]:nth(${switchIndex})`).click()
})

Cypress.Commands.add('navigateToKnowledgeBase', () => {
  cy.contains('Knowledge base').click()
  cy.location('pathname').should('include', '/knowledge-base', {
    timeout: 10000,
  })
})

Cypress.Commands.add('uploadFile', path => {
  cy.get('input[aria-label="Upload files"]').selectFile(
    `cypress/fixtures/${path}`,
    { force: true },
  )
})

Cypress.Commands.add('canUseKB', () => {
  // Upload multiple files
  cy.uploadFile('docs/chapter1_test.docx')
  cy.uploadFile('docs/chapter2_test.docx')
  cy.uploadFile('docs/chapter3_test.docx')

  // Upload pending files in bulk
  cy.get('button[aria-label="Upload pending files"]').click()

  cy.get('li[title="chapter1_test"]').should('exist')
  cy.get('li[title="chapter2_test"]').should('exist')
  cy.get('li[title="chapter3_test"]').should('exist')
  cy.get('button[aria-label="Upload pending files"]').should(
    'have.attr',
    'disabled',
  )
  cy.get('button[aria-label="Delete selected files"]').should(
    'have.attr',
    'disabled',
  )
})
