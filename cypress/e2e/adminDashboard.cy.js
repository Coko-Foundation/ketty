const { admin } = require('../support/credentials')

describe('accessing admin dashboard', () => {
  beforeEach(() => {
    cy.login(admin)
  })

  it('admin can acess the admin dashboard', () => {
    cy.get('.ant-avatar-string').click()
    cy.contains('Admin').click()
    cy.location('pathname').should('equal', '/admin')
    cy.get('h1').should('have.text', 'Admin dashboard')
  })
})

describe('checking AI integration', () => {
  before(() => {
    cy.login(admin)
    cy.addBook('AI Book')
    cy.logout()
  })

  beforeEach(() => {
    cy.login(admin)
    cy.goToAdminDashboard()
    cy.get('h2:nth(0)').should('have.text', 'AI integration')
  })

  it('checking default values for AI integration (ON)', () => {
    cy.contains('span', 'AI supplier integration').should('exist')
    cy.get('button[role="switch"]:nth(0)').should(
      'have.attr',
      'aria-checked',
      'true',
    )

    cy.get('form').should('contain', 'Api key')

    // Checking that there is an API key
    cy.get('form').find('#apiKey').invoke('val').should('not.be.empty')
    cy.get('button[type="submit"]')
      .should('have.text', 'Update key')
      .should('be.enabled')

    // Checking Book Settings when AI integration is on
    cy.get('[href="/dashboard"]').first().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.goToBook('AI Book')
    cy.openBookSettings()
  })

  it('checking API key field', () => {
    cy.log('Warning displayed when key is missing')
    cy.get('form').find('#apiKey').clear()
    cy.get('#apiKey').type('{enter}')
    cy.contains('You need to provide a key').should('exist')

    cy.log('Error displayed when key is invalid')
    cy.get('#apiKey').type('This is some dummy text')
    cy.get('button[type="submit"]').should('have.text', 'Update key').click()
    cy.get('button[type="submit"]').should('have.text', 'Update key').click()

    cy.contains('API key is invalid').should('exist')
  })

  it('switching AI integration OFF', () => {
    cy.get('button[role="switch"]:nth(0)').click()
    cy.get('button[role="switch"]:nth(0)').should(
      'have.attr',
      'aria-checked',
      'false',
    )

    // Add check about form
    cy.get('#apiKey').should('have.class', 'ant-input-disabled')

    // Checking that Book Settings do not exist when AI integration is off
    cy.get('[href="/dashboard"]').first().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.goToBook('AI Book')
    cy.get('li[role="menuitem"]:nth(3)').should('not.exist')
  })
})

describe('checking POD', () => {
  before(() => {
    cy.login(admin)
    cy.addBook('POD Book')
    cy.logout()
  })

  beforeEach(() => {
    cy.login(admin)
    cy.goToAdminDashboard()
    cy.get('h2:nth(1)').should(
      'have.text',
      'Print on demand supplier integration',
    )
  })

  it('checking default values for POD (ON)', () => {
    cy.contains('span', 'Lulu').should('exist')
    cy.get('button[role="switch"]:nth(1)').should(
      'have.attr',
      'aria-checked',
      'true',
    )

    // Checking Preview page when POD is on
    cy.get('[href="/dashboard"]').first().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.goToBook('POD Book')
    cy.goToPreview()
    cy.contains('New export').should('exist')
    cy.contains('Save').should('exist')
  })

  it('switching POD OFF', () => {
    cy.contains('span', 'Lulu').should('exist')
    cy.get('button[role="switch"]:nth(1)').click()
    cy.contains('span', 'Lulu').should('exist')
    cy.get('button[role="switch"]:nth(1)').should(
      'have.attr',
      'aria-checked',
      'false',
    )

    // Checking Preview page when POD is off
    cy.get('[href="/dashboard"]').first().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.goToBook('POD Book')
    cy.goToPreview()
    cy.contains('New export').should('not.exist')
    cy.contains('Save').should('not.exist')
  })
})

describe('checking Terms & Conditions', () => {
  beforeEach(() => {
    cy.login(admin)
    cy.goToAdminDashboard()
    cy.get('h2:nth(2)').should('have.text', 'Terms and conditions')
  })

  it('checking default content in T&C section', () => {
    cy.contains(
      'p',
      'Provide the terms and conditions that users must agree to on sign up',
    ).should('exist')
    cy.get('button[title="Change to Paragraph"]').should(
      'have.attr',
      'aria-pressed',
      'true',
    )
    cy.get('p:nth(1)').should('have.text', '')
    cy.contains('span', 'Update Terms and Conditions').should('exist')

    const toolbarButtons = [
      'Change to Title',
      'Change to heading level 2',
      'Change to heading level 3',
      'Toggle strong',
      'Toggle emphasis',
      'Add or remove link',
      'Wrap in ordered list',
      'Wrap in bullet list',
    ]

    toolbarButtons.forEach(button => {
      cy.get(`button[title="${button}"]`).should(
        'have.attr',
        'aria-pressed',
        'false',
      )
    })

    cy.log('Checking that T&C modal in Sign up page is empty.')
    cy.logout()
    cy.openTCModal()
    cy.get('p').should('have.text', '')
    cy.contains('span', 'Agree').should('exist')
  })

  it('Adding content in T&C & verifying it displays correctly in the modal', () => {
    // Adding a link
    cy.get('.ProseMirror').type('Some link{selectall}')
    cy.addLink('www.examplelink.com')

    cy.get('.ProseMirror').click()
    cy.get('.ProseMirror').type(' This is some text.{enter}')

    const formatCommands = [
      { title: 'Change to Title', tag: 'h1:nth(1)', text: 'This is a title.' },
      {
        title: 'Change to heading level 2',
        tag: 'h2',
        text: 'This is a heading 2.',
      },
      {
        title: 'Change to heading level 3',
        tag: 'h3',
        text: 'This is a heading 3.',
      },
      { title: 'Toggle strong', tag: 'strong', text: 'This is bold text.' },
      { title: 'Toggle emphasis', tag: 'em', text: 'This is emphasized text.' },
    ]

    formatCommands.forEach(({ title, text }) => {
      cy.get(`button[title="${title}"]`).click()
      cy.get('.ProseMirror').type(`${text}{enter}`)
    })

    cy.get('.ProseMirror').type('This is a paragraph.{enter}')

    const listItems = ['item1', 'item2', 'item3']
    cy.addLists(['item1', 'item2', 'item3'], true) // Adding ordered list
    cy.addLists(['item1', 'item2', 'item3'], false) // Adding bullet list

    cy.contains('span', 'Update Terms and Conditions').click()
    cy.contains('Terms and Conditions updated successfully')
    cy.log('Terms and Conditions were updated.')

    cy.log('Checking that content in T&C modal in Sign up page is updated.')
    cy.logout()
    cy.openTCModal()
    cy.get('p').first().should('have.text', 'Some link This is some text.')

    formatCommands.forEach(({ tag, text }) => {
      cy.get(tag).should('have.text', text)
    })

    cy.verifyListContent(listItems, 'ol>li')
    cy.verifyListContent(listItems, 'ul>li>.paragraph')
  })
})

Cypress.Commands.add('goToAdminDashboard', () => {
  cy.get('.ant-avatar-string').click()
  cy.contains('Admin').click()
  cy.location('pathname').should('equal', '/admin')
})

Cypress.Commands.add('openBookSettings', () => {
  cy.get('[role="menuitem"]:nth(3)').click()
  cy.contains('Book settings').should('exist')
  cy.contains('AI writing prompt use').should('exist')
})

Cypress.Commands.add('addLists', (listItems, isOrdered) => {
  const listType = isOrdered ? 'ordered' : 'bullet'
  cy.get(`[title='Wrap in ${listType} list']`).click()
  cy.wrap(listItems).each(li => {
    cy.get('.ProseMirror').type(`${li}{enter}`)
  })
  cy.get('.ProseMirror').type('{enter}')
})
Cypress.Commands.add('verifyListContent', (listItems, listSelector) => {
  cy.get(`${listSelector}`).each(($el, index) => {
    cy.get($el).should('contain', listItems[index], { timeout: 8000 })
  })
})

Cypress.Commands.add('openTCModal', () => {
  cy.visit('http://localhost:4000')
  cy.get("a[href='/signup']")
    .contains('Do you want to sign up instead?')
    .click()
  cy.location('pathname').should('equal', '/signup')
  cy.get('#termsAndConditions').click()
  cy.contains('Usage Terms and Conditions').should('exist')
})

Cypress.Commands.add('addLink', link => {
  cy.get('button[title="Add or remove link"]').should('not.be.disabled')
  cy.get('button[title="Add or remove link"]').click({ force: true })
  cy.get('input').last().type(link)
  cy.contains('button', 'Apply').click()
})
