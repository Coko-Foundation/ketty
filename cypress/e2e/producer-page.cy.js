/* eslint-disable no-plusplus */
/* eslint-disable jest/expect-expect */
describe('Producer Page', () => {
  beforeEach(() => {
    cy.login()
  })

  it('checking left side panel', () => {
    cy.addBook('Test Book')
    cy.contains('Test Book').click()
    cy.url().should('include', '/producer')
    cy.contains('div', 'Test Book')
    cy.contains('button', 'Book Metadata')
      .should('be.visible')
      .should('not.be.disabled')
      .click()
    cy.get('[data-icon="close"]').click()
    cy.contains('div', 'Chapters')

    // uploading a file
    // cy.get('.ant-btn-icon').first().parent().click()
    // cy.get('input[type="file"]').selectFile(
    //   'cypress/fixtures/docs/test_document.docx',
    //   { force: true },
    // )

    // adding a chapter
    cy.get('.anticon-plus').click()
    cy.contains('Untitled Chapter').click()
    cy.get('[title="Change to Title"]').click()
    cy.get('h1').type('Title of chapter 1')

    // NEEDS TO ADD DND TOO
  })

  it('checking metadata', () => {
    // cy.addBook('Test Book')
    cy.contains('Test Book').click()
    cy.url().should('include', '/producer')

    cy.contains('button', 'Book Metadata').click()

    cy.get('.ant-modal-title').should('have.text', 'Book Metadata')

    cy.get('.ant-modal-body')
      .find('p:nth(0)')
      .should(
        'have.text',
        'This information will be used for additional book pages that are optional, go to Preview to see the pages and decide which ones you want to include in your book',
      )

    // checking default values for title page section
    cy.get('h2').first().should('have.text', 'TITLE PAGE')
    cy.get('label[title="Title"]').should('have.text', 'Title')
    cy.get('#title').should('have.value', 'Test Book')
    cy.get('label[title="Subtitle"]').should('have.text', 'Subtitle')
    cy.get('#subtitle')
      .should('have.attr', 'placeholder', 'Optional')
      .should('be.empty')
    cy.get('label[title="Authors"]').should('have.text', 'Authors')
    cy.get('#authors')
      .should('have.attr', 'placeholder', 'Jhon, Smith')
      .should('be.empty')

    // editing fields of title page section
    // cy.get('#title').type('New title')
    // cy.get('#subtitle').type('New subtitle')
    // cy.get('#authors').type('Test Author')

    // checking default values for copyright page section
    cy.get('h2').last().should('have.text', 'COPYRIGHT PAGE')
    cy.get('label[title="ISBN"]').should('have.text', 'ISBN')
    cy.get('#isbn')
      .should(
        'have.attr',
        'placeholder',
        'Update this ISBN before exporting versions requiring unique identifier',
      )
      .should('be.empty')
    cy.get('label[title="Top of the page"]').should(
      'have.text',
      'Top of the page',
    )
    cy.get('#topPage')
      .should(
        'have.attr',
        'placeholder',
        'Optional - Provide additional description that will appear on the top of the Copyright page',
      )
      .should('be.empty')
    cy.get('label[title="Bottom of the page"]').should(
      'have.text',
      'Bottom of the page',
    )
    cy.get('#bottomPage')
      .should(
        'have.attr',
        'placeholder',
        'Optional - Provide additional description that will appear on the top of the Copyright page',
      )
      .should('be.empty')

    cy.get('label[title="Copyright License"]').should(
      'have.text',
      'Copyright License',
    )

    // All Rights Reserved - Standard Copyright License option
    const licenseInfo = [
      {
        title: 'All Rights Reserved - Standard Copyright License',
        description:
          'All Rights Reserved licensing. Your work cannot be distributed, remixed, or otherwise used without your express consent.',
      },
      {
        title: 'Some Rights Reserved - Creative Commons (CC BY)',
        description:
          'Some rights are reserved, based on the specific Creative Commons Licensing you select.What is Creative Commons?',
      },
      {
        title: 'No Rights Reserved - Public Domain',
        description:
          'No rights are reserved and the work is freely available for anyone to use, distribute, and alter in any way.',
      },
    ]

    licenseInfo.forEach((license, index) => {
      cy.get(`strong:nth(${index})`).should('have.text', license.title)
      cy.get(`strong:nth(${index})`)
        .siblings()
        .should('have.text', license.description)

      // Check that non of the options is selected
      cy.get(`input[type="radio"]:eq(${index})`).should(
        'not.have.attr',
        'checked',
      )
    })

    // cy.get('.ant-collapse-expand-icon').click()

    // cy.get('label[title="Copyright holder name (optional)"]').should(
    //   'have.text',
    //   'Copyright holder name (optional)',
    // )
    // cy.get('#ncCopyrightHolder').should('be.empty')

    // cy.get('label[title="Copyright year (optional)"]').should(
    //   'have.text',
    //   'Copyright year (optional)',
    // )

    // cy.get('#ncCopyrightYear')
    //   .should('have.attr', 'placeholder', 'Select year')
    //   .should('be.empty')
  })

  it('editing metadata', () => {
    // cy.addBook('Test Book')
    cy.contains('Test Book').click()
    cy.url().should('include', '/producer')

    cy.contains('button', 'Book Metadata').click()

    cy.get('.ant-modal-title').should('have.text', 'Book Metadata')

    // // editing fields of title page section
    // cy.get('#title').type('{selectall}{backspace}New title')
    // cy.get('#subtitle').type('New subtitle')
    // cy.get('#authors').type('Test Author')

    // // editing fields of title page section
    // cy.get('#isbn').type('978-3-16-148410-0')
    // cy.get('#topPage').type(
    //   "Portions of this book are works of fiction. Any references to historical events, real people, or real places are used fictitiously. Other names, characters, places and events are products of the author's imagination, and any resemblances to actual events or places or persons, living or dead, is entirely coincidental.",
    // )
    // cy.get('#bottomPage').type('www.author-website.com')

    // // checking the values of the edited fiels
    // cy.get('#title').should('have.value', 'New title')
    // cy.get('#subtitle').should('have.value', 'New subtitle')
    // cy.get('#authors').should('have.value', 'Test Author')
    // cy.get('#isbn').should('have.value', '978-3-16-148410-0')
    // cy.get('#topPage').should(
    //   'have.value',
    //   "Portions of this book are works of fiction. Any references to historical events, real people, or real places are used fictitiously. Other names, characters, places and events are products of the author's imagination, and any resemblances to actual events or places or persons, living or dead, is entirely coincidental.",
    // )
    // cy.get('#bottomPage').should('have.value', 'www.author-website.com')

    // Edit title page section

    // Custom command to set input values and verify them
    Cypress.Commands.add('setValueAndVerify', (selector, value) => {
      cy.get(selector).clear()
      cy.get(selector).type(value)
      cy.get(selector).should('have.value', value)
    })

    cy.setValueAndVerify('#title', 'New title')
    cy.setValueAndVerify('#subtitle', 'New subtitle')
    cy.setValueAndVerify('#authors', 'Test Author')
    cy.setValueAndVerify('#isbn', '978-3-16-148410-0')
    cy.setValueAndVerify(
      '#topPage',
      "Portions of this book are works of fiction. Any references to historical events, real people, or real places are used fictitiously. Other names, characters, places and events are products of the author's imagination, and any resemblances to actual events or places or persons, living or dead, is entirely coincidental.",
    )
    cy.setValueAndVerify('#bottomPage', 'www.author-website.com')

    // verify only one of the radio buttons in "Copyright License" section can be selected
    // cy.get('strong:nth(0)').click()
    // cy.get(`input[type="radio"]:nth(0)`).should('have.attr', 'checked')

    // cy.get(`input[type="radio"]:nth(1)`).should('not.have.attr', 'checked')

    // cy.get(`input[type="radio"]:nth(1)`).should('not.have.attr', 'checked')

    // cy.get('strong:nth(1)').click()
    // cy.get(`input[type="radio"]:nth(1)`).should('have.attr', 'checked')

    // cy.get(`input[type="radio"]:nth(0)`).should('not.have.attr', 'checked')

    // cy.get(`input[type="radio"]:nth(2)`).should('not.have.attr', 'checked')

    // cy.get('strong:nth(2)').click()
    // cy.get(`input[type="radio"]:nth(2)`).should('have.attr', 'checked')

    // cy.get(`input[type="radio"]:nth(0)`).should('not.have.attr', 'checked')

    // cy.get(`input[type="radio"]:nth(1)`).should('not.have.attr', 'checked')

    // selecting All Rights Reserved - Standard Copyright License
    cy.get('strong:nth(0)').click()
    cy.get('.ant-collapse-expand-icon').should('exist')

    cy.get('label[title="Copyright holder name (optional)"]').should(
      'have.text',
      'Copyright holder name (optional)',
    )
    cy.get('#ncCopyrightHolder').should('be.empty')

    cy.get('label[title="Copyright year (optional)"]').should(
      'have.text',
      'Copyright year (optional)',
    )

    cy.get('#ncCopyrightYear')
      .should('have.attr', 'placeholder', 'Select year')
      .should('be.empty')

    cy.get('#ncCopyrightHolder').type('University of California')
    cy.get('#ncCopyrightYear').type('2019{enter}', { force: true })

    // selecting Some Rights Reserved
    cy.get('strong:nth(1)').click()
    cy.get('.ant-collapse-expand-icon').should('exist')

    cy.get('label[title="Copyright holder name (optional)"]').should(
      'have.text',
      'Copyright holder name (optional)',
    )
    cy.get('#saCopyrightHolder').should('be.empty')

    cy.get('label[title="Copyright year (optional)"]').should(
      'have.text',
      'Copyright year (optional)',
    )

    cy.get('#saCopyrightYear')
      .should('have.attr', 'placeholder', 'Select year')
      .should('be.empty')

    cy.get('#saCopyrightHolder').type('University of California')
    cy.get('#saCopyrightYear').type('2021{enter}', { force: true })

    cy.get('.ant-checkbox:nth(0)')
      .siblings()
      .should('have.text', 'NonCommercial (NC)')

    cy.get('.ant-checkbox:nth(1)')
      .siblings()
      .should('have.text', 'ShareAlike (SA)')

    cy.get('.ant-checkbox:nth(2)')
      .siblings()
      .should('have.text', 'NoDerivatives (ND)')

    // Selecting NC & SA, ND is disabled
    cy.get('.ant-checkbox:nth(0)').click()
    cy.get('.ant-checkbox:nth(1)').click()
    // cy.get('.ant-checkbox-wrapper-checked')
    cy.get('.ant-checkbox:nth(2)').should('have.class', 'ant-checkbox-disabled')

    // Selecting NC & ND, SA is disabled
    cy.get('.ant-checkbox:nth(1)').click() // unselecting SA
    cy.get('.ant-checkbox:nth(2)').click() // selecting ND
    cy.get('.ant-checkbox:nth(1)').should('have.class', 'ant-checkbox-disabled')

    // selecting No Rights Reserved
    cy.get('strong:nth(2)').click()
    cy.get('.ant-collapse-expand-icon').should('exist')

    cy.get('input[value="cc0"]')
      .parent()
      .should('not.have.class', 'ant-radio-checked')
    cy.get('#publicDomainType > :nth-child(1)').should(
      'contain',
      'Creative Commons Zero (CC 0)You waive any copyright and release of your work to the public domain. Use only if you are the copyright holder or have permission from the copyright holder to release the work.',
    )

    cy.get('input[value="public"]')
      .parent()
      .should('not.have.class', 'ant-radio-checked')

    cy.get('#publicDomainType > :nth-child(2)').should(
      'contain',
      'No Known Copyright (Public Domain)By selecting this option, you certify that, to the best of your knowledge, the work is free of copyright worldwide.',
    )

    // when checking cc0, publis is unchecked
    cy.get('input[value="cc0"]').click()
    cy.get('input[value="cc0"]')
      .parent()
      .should('have.class', 'ant-radio-checked')
    cy.get('input[value="public"]')
      .parent()
      .should('not.have.class', 'ant-radio-checked')

    // when checking public, cc0 is unchecked
    cy.get('input[value="public"]').click()
    cy.get('input[value="cc0"]')
      .parent()
      .should('not.have.class', 'ant-radio-checked')
    cy.get('input[value="public"]')
      .parent()
      .should('have.class', 'ant-radio-checked')
  })
})
