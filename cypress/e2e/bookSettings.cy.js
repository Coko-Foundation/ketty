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

  it('By default all options are disabled in the modal', () => {
    cy.login(admin)
    cy.goToBook(testBook)
    cy.openBookSettings()

    cy.contains('AI writing prompt use').should('exist')
    cy.contains(
      'Users with edit access to this book can use AI writing prompts',
    ).should('exist')
    cy.verifySwitch('toggleAI', 'disabled')

    cy.contains('AI Book Designer (Beta)').should('exist')
    cy.contains(
      'Users with edit access to this book can use the AI Book Designer',
    ).should('exist')
    cy.verifySwitch('AIDesigner', 'disabled')

    cy.contains('Knowledge Base').should('exist')
    cy.contains(
      'Users with edit access to this book can create and query a knowledge base.',
    ).should('exist')
    cy.verifySwitch('kb', 'disabled')

    cy.getByData('settings-save-btn').should('have.attr', 'type', 'submit')
    cy.getByData('settings-cancel-btn').should('have.attr', 'type', 'reset')

    // Checking that AI pen does not exist in the toolbar
    cy.get('span[aria-label="close"]').click()
    cy.verifyAIPen(false)
  })

  it('changes in the modal are saved only upon clicking the Save button', () => {
    cy.login(admin)
    cy.goToBook(testBook)
    cy.openBookSettings()

    // Enabling AI writing prompt use but not saving by book owner
    cy.toogleSwitch('toggleAI')
    cy.verifySwitch('toggleAI', 'enabled')
    cy.get('span[aria-label="close"]').click()

    cy.openBookSettings()
    cy.verifySwitch('toggleAI', 'disabled')

    // Enabling AI writing prompt use and saving by book owner
    cy.toogleSwitch('toggleAI')
    cy.verifySwitch('toggleAI', 'enabled')
    cy.getByData('settings-save-btn').click()
    cy.contains('Book settings').should('not.exist', { timeout: 6000 })

    cy.openBookSettings()
    cy.verifySwitch('toggleAI', 'enabled')

    // Disabling AI writing prompt by book owner
    cy.toogleSwitch('toggleAI')
    cy.verifySwitch('toggleAI', 'disabled')
    cy.getByData('settings-save-btn').click()
  })

  context("checking users' permissions in the modal", () => {
    it('BOOK OWNER can change settings', () => {
      cy.login(admin)
      cy.goToBook(testBook)

      cy.openBookSettings()
      cy.getByData('settings-save-btn').should('not.have.attr', 'disabled')
    })

    it('COLLABORATOR with EDIT access can NOT change settings', () => {
      cy.login(collaborator1)
      cy.goToBook(testBook)

      cy.openBookSettings()
      cy.getByData('settings-toggleAI-switch').should('have.attr', 'disabled')
      cy.getByData('settings-AIDesigner-switch').should('have.attr', 'disabled')
      cy.getByData('settings-save-btn').should('have.attr', 'disabled')
      cy.getByData('settings-cancel-btn').click()
    })

    it('COLLABORATOR with VIEW access can NOT access book settings', () => {
      cy.login(collaborator2)
      cy.goToBook(testBook)
      cy.get('[aria-label="Book settings"]').should('not.exist')
    })
  })
})

describe('AI writing prompt is enabled', () => {
  context('Default options', () => {
    before(() => {
      cy.login(admin)
      cy.goToBook(testBook)

      // Switching AI writing prompt on
      cy.openBookSettings()
      cy.toogleSwitch('toggleAI')
      cy.getByData('settings-save-btn').click()
      cy.logout()
    })

    beforeEach(() => {
      cy.login(admin)
      cy.goToBook(testBook)
      cy.openBookSettings()
    })

    it('checking default options', () => {
      // Checking the two options for AI writing prompt
      cy.contains('Free-text writing prompts').should('exist')
      // cy.verifySwitch(1, 'enabled')
      cy.verifySwitch('freeTextPrompt', 'enabled')
      cy.contains('Customize AI writing prompts').should('exist')
      cy.verifySwitch('customPrompt', 'disabled')
    })

    it('checking that both options cannot be disabled simultaneously.', () => {
      // Disabling 'Free-text writing prompts' automatically enables 'Customize AI writing prompts'
      cy.toogleSwitch('freeTextPrompt') // disabling free text prompts
      cy.verifySwitch('freeTextPrompt', 'disabled')
      cy.verifySwitch('customPrompt', 'enabled') // customized prompts gets enabled automatically

      // Disabling 'Customize AI writing prompts' automatically enables 'Free-text writing prompts'
      cy.toogleSwitch('customPrompt') // disabling customized prompts
      cy.verifySwitch('customPrompt', 'disabled')
      cy.verifySwitch('freeTextPrompt', 'enabled') // free-text prompts gets enabled automatically
    })
  })

  context(
    'Free text-writing prompts are enabled & Customized prompts are disabled',
    () => {
      it('Book owner can use AI free-text writing prompts', () => {
        cy.login(admin)
        cy.goToBook(testBook)
        cy.verifyAIPen(true)
        cy.contains('Untitled Chapter')
        cy.usingAIPrompt()
      })

      it('Collaborator with EDIT access can use AI free-text writing prompts', () => {
        cy.login(collaborator1)
        cy.goToBook(testBook)
        cy.verifyAIPen(true)

        cy.contains('Untitled Chapter')
        cy.wait(5000)
        cy.get('.ProseMirror').clear()
        cy.usingAIPrompt()
      })

      it('Collaborator with VIEW access can NOT use AI free-text writing prompts', () => {
        cy.login(collaborator2)
        cy.goToBook(testBook)
        cy.verifyAIPen(true)
        cy.contains('Untitled Chapter')
        cy.canNotEdit()
      })
    },
  )
  context('Enabling customized prompts', () => {
    it('checking customized prompts field and delete button', () => {
      cy.login(admin)
      cy.goToBook(testBook)
      cy.contains('Untitled Chapter').click()
      cy.contains(
        'Create or select a chapter in the chapters panel to start writing',
      ).should('exist')
      cy.openBookSettings()

      // Enabling customized prompts
      cy.toogleSwitch('customPrompt')
      cy.verifySwitch('customPrompt', 'enabled')

      cy.get('#prompt')
        .should('exist')
        .should('have.attr', 'placeholder')
        .and('eq', 'Add Prompt')

      // Add a prompt
      cy.contains('button', 'Add Prompt').should('have.attr', 'type', 'submit')
      cy.addPrompt('Translate to Italian')

      // Deleting prompt
      cy.get('[aria-label="delete"]').click()
      cy.contains('Translate to Italian').should('not.exist')

      // Check warning if field is empty
      cy.get('#prompt').type(' {enter}')
      cy.contains('Please input a prompt').should('exist')
    })
  })

  context(
    'Free text-writing prompts are disabled & Customized prompts are enabled',
    () => {
      before(() => {
        cy.login(admin)
        cy.goToBook(testBook)
        cy.contains('Untitled Chapter').click()
        cy.contains(
          'Create or select a chapter in the chapters panel to start writing',
        ).should('exist')
        cy.openBookSettings()

        // Enabling customized prompts
        cy.toogleSwitch('freeTextPrompt')
        cy.verifySwitch('freeTextPrompt', 'disabled')
        cy.verifySwitch('customPrompt', 'enabled')

        // Add a couple of prompts
        cy.addPrompt('Translate to French')
        cy.addPrompt('Capitalize each word')
        cy.getByData('settings-save-btn').click()
        cy.contains(
          'Create or select a chapter in the chapters panel to start writing',
          { timeout: 10000 },
        ).should('be.visible')
        cy.logout()
      })
      it('Book owner can use AI customized prompts', () => {
        cy.login(admin)
        cy.goToBook(testBook)
        cy.contains('Untitled Chapter')
        cy.contains(
          'Create or select a chapter in the chapters panel to start writing',
        ).should('not.exist')
        cy.useCustomizedPrompt()
      })

      it('Collaborator with EDIT access can use AI customized prompts', () => {
        cy.login(collaborator1)
        cy.goToBook(testBook)
        cy.contains('Untitled Chapter')
        cy.useCustomizedPrompt()
      })

      it('Collaborator with VIEW access can NOT use AI customized prompts', () => {
        cy.login(collaborator2)
        cy.goToBook(testBook)
        cy.contains('Untitled Chapter')
        cy.canNotEdit()
      })
    },
  )
  context(
    'Both Free text-writing prompts & Customized prompts are enabled',
    () => {
      before(() => {
        cy.login(admin)
        cy.goToBook(testBook)
        cy.openBookSettings()

        // Enabling customized prompts
        cy.toogleSwitch('freeTextPrompt')
        cy.verifySwitch('freeTextPrompt', 'enabled')
        cy.verifySwitch('customPrompt', 'enabled')
        cy.getByData('settings-save-btn').click()
        cy.logout()
      })
      it('Book owner can use both AI customized prompts and free-writing text prompts', () => {
        cy.login(admin)
        cy.goToBook(testBook)
        cy.contains('Untitled Chapter')
        cy.usingAIPrompt()
        cy.useCustomizedPrompt()
      })

      it('Collaborator with EDIT access can use both AI customized prompts and free-writing text prompts', () => {
        cy.login(collaborator1)
        cy.goToBook(testBook)
        cy.contains('Untitled Chapter')
        cy.usingAIPrompt()
        cy.useCustomizedPrompt()
      })

      it('Collaborator with VIEW access can NOT use either AI customized prompts or free-writing text prompts', () => {
        cy.login(collaborator2)
        cy.goToBook(testBook)
        cy.contains('Untitled Chapter')
        cy.canNotEdit()
      })
    },
  )
})

describe('AI Book Designer (Beta)', () => {
  before(() => {
    cy.login(admin)
    cy.goToBook(testBook)

    // Enabling AI Book Designer page
    cy.openBookSettings()
    cy.verifySwitch('AIDesigner', 'disabled')
    cy.toogleSwitch('AIDesigner')
    cy.verifySwitch('AIDesigner', 'enabled')
    cy.getByData('settings-save-btn').click()
    cy.contains('Book settings').should('not.exist', { timeout: 6000 })

    cy.logout()
  })

  it('BOOK OWNER can access AI Book Designer page', () => {
    cy.login(admin)
    cy.goToBook(testBook)

    cy.canUseAiPdfDes()
  })

  it('COLLABORATOR with EDIT access can access AI Book Designer page', () => {
    cy.login(collaborator1)
    cy.goToBook(testBook)

    cy.canUseAiPdfDes()
  })

  it('COLLABORATOR with VIEW access can NOT access AI Book Designer page', () => {
    cy.login(collaborator2)
    cy.goToBook(testBook)
    cy.contains('AI Book Designer (Beta)').should('not.exist')
  })
})

Cypress.Commands.add('canNotEdit', () => {
  cy.get('.ProseMirror').click()
  cy.get('button[title="Toggle Ai"]').should('be.disabled')
})

Cypress.Commands.add('verifyAIPen', shouldBeVisible => {
  if (shouldBeVisible) {
    cy.get('button[title="Toggle Ai"]')
      .should('exist')
      .should('have.attr', 'aria-pressed', 'false')
  } else {
    cy.get('button[title="Toggle Ai"]').should('not.exist')
  }
})

Cypress.Commands.add('addPrompt', customPrompt => {
  cy.get('.ant-modal-confirm-body').within(() => {
    cy.get('input[id="prompt"]', { timeout: 8000 }).type(`${customPrompt}`, {
      delay: 100,
    })
    cy.contains('button', 'Add Prompt').click()
    cy.contains(`${customPrompt}`).should('exist')
  })
})

Cypress.Commands.add('usingAIPrompt', () => {
  cy.wait(6000)
  cy.get('.ProseMirror', { timeout: 10000 }).type('Add a paragraph{selectall}')
  cy.get('button[title="Toggle Ai"]').should('not.be.disabled')
  cy.get('button[title="Toggle Ai"]').click({ force: true })

  cy.get('input[id="askAiInput"]')
    .should('have.attr', 'placeholder')
    .and('eq', 'How can I help you? Type your prompt here.')

  cy.get('input[id="askAiInput"]').as('askAiInput')

  // cy.get('@askAiInput')
  //   .should('be.visible')
  //   .then($input => {
  //     // Explicitly focus on the input field
  //     cy.wrap($input)
  //       // .focus()
  //       .type('Replace this with a similiar sentence {enter}', { delay: 100 })
  //   })
  cy.get('@askAiInput').should('be.visible')

  cy.get('@askAiInput')
    // .focus()
    .then($input => {
      const text = 'Replace this with a similar sentence'
      const delay = 50 // Adjust delay as needed

      // Type each character with a delay
      cy.wrap($input).then(() => {
        for (let i = 0; i < text.length; i += 1) {
          cy.wrap($input).type(text[i], { delay, force: true })
        }
      })

      // Ensure the text is correctly entered
      cy.wrap($input).should('have.value', text)
    })

    .type('{enter}', { force: true })

  cy.contains('Try Again', { timeout: 10000 }).should('be.visible').click()

  // There is a bug with the insert button. Add test when it is fixed.
  // cy.contains('Insert', { timeout: 10000 })
  //   .should('be.visible')
  //   .click()
  cy.contains('Discard', { timeout: 10000 }).should('be.visible').click()

  cy.get('@askAiInput')
    .parent()
    .should('be.visible')
    .type('Replace this with a similiar sentence {enter}')

  cy.wait(6000)
  cy.contains('Replace selected text', { timeout: 10000 })
    .should('be.visible')
    .click()

  // cy.wait(6000)
  cy.contains('Add a paragraph', { timeout: 10000 }).should('not.exist')
})

Cypress.Commands.add('useCustomizedPrompt', () => {
  cy.wait(6000)
  cy.get('.ProseMirror', { timeout: 10000 }).clear()
  cy.get('.ProseMirror').type('Chapter 1', { delay: 100 })
  cy.get('.ProseMirror').type('{selectall}')
  cy.get('button[title="Toggle Ai"]').click({ force: true })
  cy.contains('button', 'Custom Prompts').click()
  cy.contains('Capitalize each word').should('exist')
  cy.contains('Translate to French').should('exist').click()
  cy.get('#askAiInput').should('have.value', 'Translate to French', {
    timeout: 6000,
  })
  cy.contains('Chapitre 1', { timeout: 10000 }).should('be.visible')
  cy.contains('Replace selected text', { timeout: 10000 })
    .should('be.visible')
    .click()
  cy.contains('.ProseMirror', 'Chapitre 1')
})

Cypress.Commands.add('canUseAiPdfDes', () => {
  cy.contains('AI Book Designer (Beta)').should('exist')
  cy.contains('AI Book Designer (Beta)').click()
  cy.location('pathname').should('include', '/ai-pdf', { timeout: 10000 })

  // Checking the chat bubble
  cy.contains('strong', 'Coko AI Book Designer:').should('exist')
  cy.contains('span', 'Hello there!').should('exist')
  cy.contains('span', "I'm here to help with your book's design").should(
    'exist',
  )
  cy.contains(
    'span',
    'You can also ask for the current property values',
  ).should('exist')
  cy.contains('span', 'for example: What is the page size of the book?').should(
    'exist',
  )
  cy.contains('span', 'Here are some suggestions to get started:').should(
    'exist',
  )
  cy.contains('button', 'Change the page size 5 x 8 inches').should('exist')
  cy.contains('button', 'Change the title font to sans serif').should('exist')
  cy.contains('button', 'Make all the headings blue').should('exist')

  // Checking Checkbox container
  cy.get('input[id="showContent"]').should('have.attr', 'checked')
  cy.get('input[id="showPreview"]').should('have.attr', 'checked')
  cy.get('input[id="showChatHistory"]').should('not.have.attr', 'checked')

  // Checking input field
  cy.get('textarea')
    .should('have.attr', 'placeholder')
    .and('eq', 'Type your book design instruction or question here ...')
  cy.get('textarea').type('Make text content blue {enter}')
  cy.contains('Just give me a few seconds').should('exist')
  // cy.contains('The text content has been changed to blue.').should('exist', {
  //   timeout: 250000,
  // })
})
