const {
  admin,
  author,
  collaborator1,
  collaborator2,
} = require('../support/credentials')

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
    cy.login(author)
    cy.addBook(authorBook)
    cy.goToBook(authorBook)
    cy.addMember(collaborator1, 'edit')
    cy.addMember(collaborator2, 'view')
    cy.logout()
  })

  context('AI is off', () => {
    it('ADMIN can change settings', () => {
      cy.login(admin)
      cy.goToBook(authorBook)

      cy.verifyAISwitch(false)

      // Confirm default values for Book Settings
      cy.openBookSettings()
      cy.verifyBookSettings()

      // Admin can switch toggle to on
      cy.toggleAISwitch(true)
      cy.verifyAISwitch(true)

      // Admin can switch toggle to off
      cy.toggleAISwitch(false)
      cy.verifyAISwitch(false)
    })

    it('AUTHOR can change settings', () => {
      cy.login(author)
      cy.goToBook(authorBook)
      cy.verifyAISwitch(false)

      // Confirm default values for Book Settings
      cy.openBookSettings()
      cy.verifyBookSettings()

      // Author can switch toggle to on
      cy.toggleAISwitch(true)
      cy.verifyAISwitch(true)

      // Author can switch toggle to off
      cy.toggleAISwitch(false)
      cy.verifyAISwitch(false)
    })

    it('COLLABORATOR with EDIT access can NOT change settings', () => {
      cy.login(collaborator1)
      cy.goToBook(authorBook)
      cy.verifyAISwitch(false)

      // Confirm default values for Book Settings
      cy.openBookSettings()
      cy.verifyBookSettings()

      // COLLABORATOR with EDIT access can NOT switch toggle
      cy.get('[role="menuitem"]:nth(3)').click()
      cy.get('button[role="switch"]').should('have.attr', 'disabled')
    })

    it('COLLABORATOR with VIEW access can NOT change settings', () => {
      cy.login(collaborator2)
      cy.goToBook(authorBook)
      cy.verifyAISwitch(false)

      // Confirm default values for Book Settings
      cy.openBookSettings()
      cy.verifyBookSettings()

      // COLLABORATOR with EDIT access can NOT switch toggle
      cy.get('[role="menuitem"]:nth(3)').click()
      cy.get('button[role="switch"]').should('have.attr', 'disabled')
    })
  })

  context('AI is on', () => {
    it('ADMIN can use AI', () => {
      cy.login(admin)
      cy.goToBook(authorBook)
      cy.verifyAISwitch(false)

      // Admin switches toggle to on
      cy.toggleAISwitch(true)
      cy.createUntitledChapter()
      cy.usingAIPrompt()

      // Admin switches toggle to off
      cy.toggleAISwitch(false)
      cy.verifyAISwitch(false)
    })

    it('AUTHOR can use AI', () => {
      cy.login(author)
      cy.goToBook(authorBook)
      cy.verifyAISwitch(false)

      // Author switches toggle to on
      cy.toggleAISwitch(true)

      cy.deleteUntitledChapter()
      cy.createUntitledChapter()
      cy.usingAIPrompt()
    })

    it('COLLABORATOR with EDIT access can use AI', () => {
      cy.login(collaborator1)
      cy.goToBook(authorBook)
      cy.verifyAISwitch(true) // switch turned on by the author of the book

      cy.deleteUntitledChapter()
      cy.createUntitledChapter()
      cy.usingAIPrompt()
    })

    it('COLLABORATOR with VIEW access can NOT use AI', () => {
      cy.login(collaborator2)
      cy.goToBook(authorBook)
      cy.verifyAISwitch(true)
      cy.contains('Untitled Chapter').click()
      cy.get('.ProseMirror').click()
      cy.get('button[title="Toggle Ai"]').should('be.disabled')
    })
  })
})

Cypress.Commands.add('openBookSettings', () => {
  cy.get('[role="menuitem"]:nth(3)').click()
  cy.contains('Book settings').should('exist')
  cy.contains('Use AI').should('exist')
})

Cypress.Commands.add('verifyBookSettings', () => {
  cy.get('[role="switch"]').should('have.attr', 'aria-checked', 'false')
  cy.get('[data-icon="close"]').click()
})

Cypress.Commands.add('toggleAISwitch', toggleState => {
  cy.openBookSettings()
  cy.get('[role="switch"]').click()
  cy.get('[role="switch"]').should(
    'have.attr',
    'aria-checked',
    toggleState ? 'true' : 'false',
  )
  cy.get('[data-icon="close"]').click()
})

Cypress.Commands.add('verifyAISwitch', shouldBeVisible => {
  if (shouldBeVisible) {
    cy.get('button[title="Toggle Ai"]')
      .should('exist')
      .should('have.attr', 'aria-pressed', 'false')
  } else {
    cy.get('button[title="Toggle Ai"]').should('not.exist')
  }
})

Cypress.Commands.add('usingAIPrompt', () => {
  cy.get('.ProseMirror').type('Add a paragraph{selectall}')

  cy.get('button[title="Toggle Ai"]').should('not.be.disabled')

  cy.get('button[title="Toggle Ai"]').click({ force: true })

  cy.get('input[id="askAiInput"]')
    .should('have.attr', 'placeholder')
    .and('eq', 'How can I help you? Type your prompt here.')

  cy.get('input[id="askAiInput"]')
    .should('be.visible')
    .then($input => {
      // Focus on the input field explicitly
      // cy.wrap($input).focus()
      cy.wrap($input).type('Replace this with a familiar sentence {enter}')
    })

  cy.contains('Try again').click()
  cy.contains('Discard').click()
  cy.get('input[id="askAiInput"]')
    .parent()
    // .click()
    .type('Replace this with a familiar sentence {enter}')
  cy.contains('Replace selected text').click()
  cy.contains('Add a paragraph').should('not.exist')
})

Cypress.Commands.add('deleteUntitledChapter', () => {
  cy.contains('Untitled Chapter').then($element => {
    if ($element.length > 0) {
      cy.contains('Untitled Chapter')
        .parent()
        .parent()
        .find('[data-icon="more"]')
        .click()
      cy.contains('Delete').click()
      cy.contains('You don’t have any chapters yet').should('exist')
    }
  })
})
