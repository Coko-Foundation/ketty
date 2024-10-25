/* eslint-disable cypress/no-unnecessary-waiting */
const { admin, author } = require('../support/credentials')

describe('accessing admin dashboard', () => {
  before(() => {
    cy.exec(
      'docker exec kdk_server_1 node ./scripts/seeds/createVerifiedUser.js author.1@example.com Author 1 author.1',
    )
    cy.log('Author 1 is created.')
  })

  it('admin can acess the admin dashboard', () => {
    cy.login(admin)
    cy.goToAdminDashboard()
    cy.logout()
  })

  it('other users cannot access the admin dashboard', () => {
    cy.login(author)
    cy.get('.ant-avatar-string').click()
    cy.contains('Admin').should('not.exist')
    cy.contains('Logout').should('exist').click()
    cy.location('pathname').should('equal', '/login')
  })
})

describe('checking AI integration', () => {
  before(() => {
    cy.login(admin)
    cy.addBook('AI Book')
    cy.goToAdminDashboard()
    cy.turnSwitchOn('ai')
    cy.logout()
  })

  beforeEach(() => {
    cy.login(admin)
    cy.goToAdminDashboard()
    cy.get('h2:nth(0)').should('have.text', 'AI integration')
  })

  it('checking default values for AI integration (ON)', () => {
    cy.checkSwitchStatus('span', 'AI supplier integration', 'ai', 'true')

    cy.get('form').should('contain', 'API Key')

    // Checking that there is an API key
    // cy.getByData('admindb-aikey-input').invoke('val').should('not.be.empty')
    cy.getByData('admindb-updateKey-btn')
      .should('have.text', 'Update Key')
      .should('be.enabled')

    // Checking Book Settings when AI integration is on
    cy.get('[href="/dashboard"]').first().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.goToBook('AI Book')
    cy.openBookSettings()
  })

  it('checking API key field', () => {
    cy.log('Warning displayed when key is missing')
    cy.getByData('admindb-aikey-input').clear()
    cy.getByData('admindb-aikey-input').type('{enter}')
    cy.contains('You need to provide a key').should('exist')

    cy.log('Error displayed when key is invalid')
    cy.getByData('admindb-aikey-input').type('This is some dummy text', {
      delay: 100,
    })

    cy.getByData('admindb-updateKey-btn')
      .should('have.text', 'Update Key')
      .click()

    cy.contains('API key is invalid', { timeout: 8000 }).should('exist')
  })

  it('switching AI integration OFF', () => {
    cy.getByData('admindb-ai-switch').click()
    cy.checkSwitchStatus('span', 'AI supplier integration', 'ai', 'false')

    // Add check about form
    cy.getByData('admindb-aikey-input').should(
      'have.class',
      'ant-input-disabled',
    )

    // Checking that Book Settings do not exist when AI integration is off
    cy.get('[href="/dashboard"]').first().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.goToBook('AI Book')
    cy.getByData('header-bookSettings-btn').should('not.exist')
  })
})

describe('checking Publishing and downloads section', () => {
  before(() => {
    cy.login(admin)
    cy.addBook('Export Book')
    cy.goToAdminDashboard()
    const switches = ['dwEPUB', 'pubWeb', 'pubPDF', 'pubEPUB']
    switches.forEach(switchId => {
      cy.turnSwitchOn(switchId)
      cy.wait(3000)
    })
    cy.logout()
  })
  beforeEach(() => {
    cy.login(admin)
    cy.goToAdminDashboard()
  })

  it('Checking that all options are ON by default', () => {
    // By default, all switches are ON
    cy.contains('h2', 'Publishing, downloads and integration').should('exist')

    // Downloads section
    cy.contains('h3', 'Downloads').should('exist')
    cy.checkSwitchStatus('span', 'PDF', 'dwPDF', 'true')
    cy.checkSwitchStatus('span', 'EPUB', 'dwEPUB', 'true')

    // Publishing integrations section
    cy.contains('h3', 'Publishing integrations').should('exist')
    cy.checkSwitchStatus('span', 'Publish online with Flax', 'pubWeb', 'true')
    cy.contains(
      'p',
      'Allow book owners to include the following downloads when publishing online:',
    ).should('exist')
    cy.checkSwitchStatus('span', 'PDF', 'pubPDF', 'true')
    cy.checkSwitchStatus('span', 'EPUB', 'pubEPUB', 'true')

    // Verifying all options are available to choose in Preview
    cy.goToNewPreview()

    cy.get('span[title="PDF"]').should('exist')
    cy.wait(5000)

    cy.contains('PDF').click()
    cy.get('div[title="EPUB"]').should('exist').click()
    cy.wait(5000)

    cy.get('span[title="EPUB"]').should('exist').click()
    cy.get('div[title="Web"]').should('exist').click()
    cy.get('span[title="Web"]').should('exist')

    cy.contains('p', 'Include the following downloads in your website').should(
      'exist',
    )
    cy.contains('span', 'Include PDF').should('exist')
    cy.get('[value = "pdf"]').should('have.attr', 'type', 'checkbox')
    cy.contains('span', 'Include EPUB').should('exist')
    cy.get('[value = "epub"]').should('have.attr', 'type', 'checkbox')
  })

  it('Disabling PDF option', () => {
    cy.getByData(`admindb-dwPDF-switch`).click()
    cy.checkSwitchStatus('span', 'PDF', 'dwPDF', 'false')
    cy.goToNewPreview()
    cy.get('span[title="PDF"]').should('not.exist')
  })

  it('Disabling EPUB option', () => {
    cy.getByData(`admindb-dwEPUB-switch`).click()
    cy.checkSwitchStatus('span', 'EPUB', 'dwEPUB', 'false')
    cy.goToNewPreview()
    cy.get('span[title="EPUB"]').should('not.exist')
  })

  it('Disabling Web option', () => {
    // // Disabling PDF download option
    // cy.getByData(`admindb-pubPDF-switch`).click()
    // cy.checkSwitchStatus('span', 'PDF', 'pubPDF', 'false')
    // cy.goToNewPreview()
    // cy.contains('span', 'Include PDF').should('not.exist')
    // cy.get('[value = "pdf"]').should('not.exist')
    // cy.wait(5000)

    // // Disabling EPUB download option
    // cy.goToAdminDashboard()
    // cy.getByData(`admindb-pubEPUB-switch`).click()
    // cy.checkSwitchStatus('span', 'EPUB', 'pubEPUB', 'false')
    // cy.goToNewPreview()
    // cy.contains('span', 'Include EPUB').should('not.exist')
    // cy.get('[value = "EPUB"]').should('not.exist')

    // Disabling Web option
    // cy.goToAdminDashboard()
    cy.getByData(`admindb-pubWeb-switch`).click()
    cy.checkSwitchStatus('span', 'Publish online with Flax', 'pubWeb', 'false')
    cy.goToNewPreview()
    cy.get('span[title="Web"]').should('not.exist')
  })
})

describe('checking POD', () => {
  before(() => {
    cy.login(admin)
    cy.addBook('POD Book')
    cy.goToAdminDashboard()
    cy.turnSwitchOn('lulu')
    cy.logout()
  })

  beforeEach(() => {
    cy.login(admin)
    cy.goToAdminDashboard()
  })

  it('checking default values for POD (ON)', () => {
    cy.checkSwitchStatus('span', 'Print-on-demand with Lulu', 'lulu', 'true')
    cy.contains('span', 'Print-on-demand with Lulu').should('exist')

    // Enabling PDF export so user can save exports
    cy.getByData(`admindb-dwPDF-switch`).click()

    // Checking Preview page when POD is on
    cy.get('[href="/dashboard"]').first().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.goToBook('POD Book')
    cy.goToPreview()
    cy.get('#rc-tabs-0-tab-new').should('have.attr', 'aria-selected', 'true')
    cy.get('#rc-tabs-0-tab-saved').should('have.attr', 'aria-selected', 'false')
    cy.getByData('preview-save-btn').should('exist')
  })

  it('switching POD OFF', () => {
    cy.contains('span', 'Print-on-demand with Lulu').should('exist')
    cy.getByData('admindb-lulu-switch').click()
    cy.checkSwitchStatus('span', 'Print-on-demand with Lulu', 'lulu', 'false')

    // Checking Preview page when POD is off
    cy.get('[href="/dashboard"]').first().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.goToBook('POD Book')
    cy.goToPreview()
    cy.contains('New export').should('not.exist')
    cy.getByData('preview-save-btn').should('not.exist')
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
    // cy.get('p:nth(1)').should('have.text', '')
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
    cy.get('p').should('not.exist')
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

    cy.getByData('admindb-updateTC-btn').click()
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
  cy.get('input').last().should('be.visible').focus()
  cy.get('input').last().type(link)
  cy.contains('button', 'Apply').should('be.visible').click()
})

Cypress.Commands.add('checkSwitchStatus', (element, content, name, status) => {
  cy.contains(`${element}`, `${content}`).should('exist')
  cy.getByData(`admindb-${name}-switch`).should(
    'have.attr',
    'aria-checked',
    `${status}`,
  )
})

Cypress.Commands.add('goToNewPreview', () => {
  cy.get('[href="/dashboard"]').first().click()
  cy.location('pathname').should('equal', '/dashboard')
  cy.goToBook('Export Book')
  cy.goToPreview()
  cy.get('#rc-tabs-0-tab-new').should('have.attr', 'aria-selected', 'true')
  cy.get('#rc-tabs-0-tab-saved').should('have.attr', 'aria-selected', 'false')
})
