/* eslint-disable jest/expect-expect */
const { admin } = require('../support/credentials')

describe('Producer Page', () => {
  before(() => {
    cy.login(admin)
    cy.addBook('Test Book')
    cy.logout()
  })
  beforeEach(() => {
    cy.login(admin)
    cy.contains('Test Book').click()
    cy.url().should('include', '/producer')
    cy.contains('div', 'Test Book')
  })

  it('checking left side panel', () => {
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
    // cy.get('.ant-btn-icon').first().parent().click()
    // cy.get('input[type="file"]')
    //   .should('exist')
    //   .trigger('change', { force: true })
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
    cy.contains('button', 'Book Metadata').click()

    cy.get('.ant-modal-title').should('have.text', 'Book Metadata')

    cy.get('.ant-modal-body')
      .find('p:nth(0)')
      .should(
        'have.text',
        'This information will be used for additional book pages that are optional, go to Preview to see the pages and decide which ones you want to include in your book',
      )

    function checkDefaultFieldValues(
      fieldTitle,
      fieldSelector,
      placeholder = '',
    ) {
      cy.get(`label[title="${fieldTitle}"]`).should('have.text', fieldTitle)
      cy.get(fieldSelector)
        .should('have.attr', 'placeholder', placeholder)
        .should('be.empty')
    }

    // Checking default values for title page section
    cy.get('h2').first().should('have.text', 'TITLE PAGE')
    cy.get('#title').should('have.value', 'Test Book')
    checkDefaultFieldValues('Subtitle', '#subtitle', 'Optional')
    checkDefaultFieldValues('Authors', '#authors', 'Jhon, Smith')

    // Checking default values for copyright page section
    cy.get('h2').last().should('have.text', 'COPYRIGHT PAGE')
    checkDefaultFieldValues(
      'ISBN',
      '#isbn',
      'Update this ISBN before exporting versions requiring unique identifier',
    )
    checkDefaultFieldValues(
      'Top of the page',
      '#topPage',
      'Optional - Provide additional description that will appear on the top of the Copyright page',
    )
    checkDefaultFieldValues(
      'Bottom of the page',
      '#bottomPage',
      'Optional - Provide additional description that will appear on the top of the Copyright page',
    )

    // Checking copyright license section
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

      // Check that none of the options is selected
      cy.get(`input[type="radio"]:eq(${index})`).should(
        'not.have.attr',
        'checked',
      )
    })
  })

  it('checking copyright licenses options', () => {
    cy.contains('button', 'Book Metadata').click()

    cy.get('.ant-modal-title').should('have.text', 'Book Metadata')

    function selectLicenseOption(index, holderName, year) {
      cy.get(`strong:nth(${index})`).click()
      cy.get('.ant-collapse-expand-icon').should('exist')

      const labels = {
        holder: 'Copyright holder name (optional)',
        year: 'Copyright year (optional)',
      }

      cy.get(`label[title="${labels.holder}"]`).should(
        'have.text',
        labels.holder,
      )
      cy.get(`#${holderName}`).should('be.empty')

      cy.get(`label[title="${labels.year}"]`).should('have.text', labels.year)
      cy.get(`#${year}`)
        .should('have.attr', 'placeholder', 'Select year')
        .should('be.empty')

      cy.get(`#${holderName}`).type('University of California', { force: true })
      cy.get(`#${year}`).type('{selectall}2019{enter}', { force: true })

      if (index === 1) {
        const checkboxLabels = [
          'NonCommercial (NC)',
          'ShareAlike (SA)',
          'NoDerivatives (ND)',
        ]

        // Iterate through checkboxes
        for (let i = 0; i < 3; i += 1) {
          cy.get(`.ant-checkbox:nth(${i})`)
            .siblings()
            .should('have.text', checkboxLabels[i])
        }

        // Selecting NC & SA, ND is disabled
        cy.get('.ant-checkbox:nth(0)').click()
        cy.get('.ant-checkbox:nth(1)').click()
        cy.get('.ant-checkbox:nth(2)').should(
          'have.class',
          'ant-checkbox-disabled',
        )

        // Selecting NC & ND, SA is disabled
        cy.get('.ant-checkbox:nth(1)').click() // unselecting SA
        cy.get('.ant-checkbox:nth(2)').click() // selecting ND
        cy.get('.ant-checkbox:nth(1)').should(
          'have.class',
          'ant-checkbox-disabled',
        )
      }
    }

    selectLicenseOption(0, 'ncCopyrightHolder', 'ncCopyrightYear')
    selectLicenseOption(1, 'saCopyrightHolder', 'saCopyrightYear')

    // selecting No Rights Reserved
    cy.get('strong:nth(2)').click()
    cy.get('.ant-collapse-expand-icon').should('exist')

    const options = [
      {
        value: 'cc0',
        description:
          'Creative Commons Zero (CC 0)You waive any copyright and release of your work to the public domain. Use only if you are the copyright holder or have permission from the copyright holder to release the work.',
      },
      {
        value: 'public',
        description:
          'No Known Copyright (Public Domain)By selecting this option, you certify that, to the best of your knowledge, the work is free of copyright worldwide.',
      },
    ]

    options.forEach(option => {
      cy.get(`input[value="${option.value}"]`)
        .parent()
        .should('not.have.class', 'ant-radio-checked')

      cy.get(
        `#publicDomainType > :nth-child(${options.indexOf(option) + 1})`,
      ).should('contain', option.description)
    })

    // when checking cc0, public is unchecked
    cy.toggleRadioButton('cc0', 'public')

    // when checking public, cc0 is unchecked
    cy.toggleRadioButton('public', 'cc0')
  })

  it('verifying that  only one of the options of Copyright License can be selected', () => {
    cy.contains('button', 'Book Metadata').click()
    cy.get('.ant-modal-title').should('have.text', 'Book Metadata')

    const licenseOptions = [
      'All Rights Reserved - Standard Copyright License',
      'Some Rights Reserved - Creative Commons (CC BY)',
      'No Rights Reserved - Public Domain',
    ]

    licenseOptions.forEach((option, index) => {
      const selector = `strong:nth(${index})`

      cy.get(selector).should('have.text', option).click()

      cy.get('.ant-collapse-item-active').should('contain', option)

      licenseOptions.forEach((otherOption, otherIndex) => {
        if (otherIndex !== index) {
          cy.get('.ant-collapse-item-active').should('not.contain', otherOption)
        }
      })
    })
  })

  it('editing metadata', () => {
    cy.contains('button', 'Book Metadata').click()
    cy.get('.ant-modal-title').should('have.text', 'Book Metadata')

    // Edit title page section
    cy.get('#title').clear()

    // Set values using the custom 'setValue' command
    cy.setValue('#title', 'New title')
    cy.setValue('#subtitle', 'New subtitle')
    cy.setValue('#authors', 'Test Author')
    cy.setValue('#isbn', '978-3-16-148410-0')
    cy.setValue(
      '#topPage',
      "Portions of this book are works of fiction. Any references to historical events, real people, or real places are used fictitiously. Other names, characters, places and events are products of the author's imagination, and any resemblances to actual events or places or persons, living or dead, is entirely coincidental.",
    )
    cy.setValue('#bottomPage', 'www.author-website.com')

    cy.get('.ant-modal-footer').contains('Save').click()
    cy.contains('button', 'Book Metadata').click()

    // Verify values using the custom 'verifyValue' command
    cy.verifyValue('#title', 'New title')
    cy.verifyValue('#subtitle', 'New subtitle')
    cy.verifyValue('#authors', 'Test Author')
    cy.verifyValue('#isbn', '978-3-16-148410-0')
    cy.verifyValue(
      '#topPage',
      "Portions of this book are works of fiction. Any references to historical events, real people, or real places are used fictitiously. Other names, characters, places and events are products of the author's imagination, and any resemblances to actual events or places or persons, living or dead, is entirely coincidental.",
    )
    cy.verifyValue('#bottomPage', 'www.author-website.com')

    // verify only one of the radio buttons in "Copyright License" section can be selected
  })
})

Cypress.Commands.add('setValue', (selector, value) => {
  cy.get(selector).type(value)
})

Cypress.Commands.add('verifyValue', (selector, value) => {
  cy.get(selector).should('have.value', value)
})

Cypress.Commands.add('toggleRadioButton', (valueToCheck, valueToUncheck) => {
  cy.get(`input[value="${valueToCheck}"]`).click()
  cy.get(`input[value="${valueToCheck}"]`)
    .parent()
    .should('have.class', 'ant-radio-checked')

  cy.get(`input[value="${valueToUncheck}"]`)
    .parent()
    .should('not.have.class', 'ant-radio-checked')
})
