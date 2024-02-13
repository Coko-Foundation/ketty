/* eslint-disable jest/expect-expect */
const { admin } = require('../support/credentials')

describe('Checking Producer Page', () => {
  before(() => {
    cy.login(admin)
    cy.addBook('Test Book')
    cy.logout()
  })

  context('Checking Left Side Panel', () => {
    beforeEach(() => {
      cy.login(admin)
      cy.contains('Test Book').click()
      cy.url().should('include', '/producer')
      cy.contains('div', 'Test Book')
    })

    it('checking content in left side panel', () => {
      cy.contains('button', 'Book Metadata')
        .should('be.visible')
        .should('not.be.disabled')
        .click()
      cy.get('[data-icon="close"]').click()

      cy.contains('div', 'Chapters')
    })

    // eslint-disable-next-line jest/no-commented-out-tests
    // it('uploading a chapter', () => {
    //     // uploading a file
    //     // DOES NOT WORK ATM
    //     cy.get('.ant-btn-icon').first().parent().click()
    //     cy.get('input[type="file"]').selectFile(
    //       'cypress/fixtures/docs/test_document.docx',
    //       { force: true },
    //     )
    // })

    it('adding and deleting a chapter', () => {
      cy.url().should('include', '/producer')
      // adding a chapter
      cy.get('.anticon-plus').click()
      cy.contains('Untitled Chapter').click()
      // cy.get('[title="Change to Title"]').click()
      cy.get('[aria-controls="block-level-options"]').click()
      cy.get(`#block-level-options > :nth-child(${1})`)
        .contains('Title')
        .click({
          timeout: 5000,
          force: true,
        })
      cy.get('h1').type('Title of chapter 1')

      // deleting a chapter
      cy.contains('Title of chapter 1')
        .parent()
        .parent()
        .find('[data-icon="more"]')
        .click()
      cy.contains('Delete').click()
      cy.contains('You don’t have any chapters yet').should('exist')
    })

    it('checking drag and drop', () => {
      const chapters = ['Chapter 1', 'Chapter 2', 'Chapter 3']

      chapters.forEach((chapter, index) => {
        cy.createChapter(chapter)
        cy.get(`.ant-list-items > :nth-child(${index + 1})`).should(
          'contain',
          chapter,
        )
      })

      cy.contains('Chapter 1').dragAndDrop('div:nth(44)', 'div:nth(57)') // moving chapter 1 below chapter 3

      cy.get('.ant-list-items > :nth-child(1)').should('contain', 'Chapter 2')
      cy.get('.ant-list-items > :nth-child(2)').should('contain', 'Chapter 3')
      cy.get('.ant-list-items > :nth-child(3)').should('contain', 'Chapter 1')
    })
  })

  context('Checking Metadata', () => {
    beforeEach(() => {
      cy.login(admin)
      cy.contains('Test Book').click()
      cy.url().should('include', '/producer')
      cy.contains('div', 'Test Book')
      cy.contains('button', 'Book Metadata').click()
      cy.get('.ant-modal-title').should('have.text', 'Book Metadata')
    })

    it('checking the content in metadata modal', () => {
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
      cy.get('label[title="ISBN List"]').should('have.text', 'ISBN List')
      cy.contains('button', ' Add ISBN').should('exist').click()

      cy.get('#isbns_0_label')
        .should('have.attr', 'placeholder', 'Label')
        .should('be.empty')

      cy.get('#isbns_0_isbn')
        .should(
          'have.attr',
          'placeholder',
          'ISBN: update this value before exporting versions requiring unique identifier',
        )
        .should('be.empty')

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

    it('checking multiple ISBNs', () => {
      // Adding the first ISBN
      cy.contains('button', ' Add ISBN').click()
      cy.setValue('#isbns_0_label', 'Paperback')
      cy.setValue('#isbns_0_isbn', '978-3-16-148410-0')

      // Adding multiple ISBNs
      cy.contains('button', ' Add ISBN').should('not.exist')
      cy.contains('button', 'Add Another ISBN').should('exist').click()

      cy.get('#isbns_1_label')
        .should('have.attr', 'placeholder', 'Label')
        .should('be.empty')

      cy.get('#isbns_1_isbn')
        .should(
          'have.attr',
          'placeholder',
          'ISBN: update this value before exporting versions requiring unique identifier',
        )
        .should('be.empty')

      cy.setValue('#isbns_1_label', 'Paperback')
      cy.setValue('#isbns_1_isbn', '978-3-16-148410-0')

      cy.get('.ant-modal-footer').contains('Save').click()

      // Cannot have two ISBNs with the same label
      cy.contains('Duplicate Label values: "Paperback"')

      // Cannot have two ISBNs with the same label
      cy.contains('Duplicate ISBN values: "978-3-16-148410-0"')
      cy.get('#isbns_1_label').clear()
      cy.contains('Label is required (for multiple ISBNs)')
      cy.setValue('#isbns_1_label', 'Hardcover')

      cy.get('#isbns_1_isbn').clear()
      cy.contains('ISBN is required')
      cy.setValue('#isbns_1_isbn', 'aaaa')
      cy.get('.ant-modal-footer').contains('Save').click()

      // Adding non numeric characters to ISBN is not allowed
      cy.contains('ISBN is invalid').should('exist')
      cy.get('#isbns_1_isbn').clear()
      cy.get('#isbns_1_isbn').type('978-3-16-148540-0')
      cy.contains('ISBN is required').should('not.exist')
      cy.get('.ant-modal-footer').contains('Save').click()

      // Removing ISBNs
      cy.contains('button', 'Book Metadata').click()
      cy.get('.ant-modal-title').should('have.text', 'Book Metadata')
      cy.get('[aria-label="minus-circle"]:nth(0)').should('exist')
      cy.get('[aria-label="minus-circle"]:nth(1)').should('exist')
      cy.get('[aria-label="minus-circle"]:nth(0)').click()
      cy.get('[aria-label="minus-circle"]:nth(0)').click()
      cy.get('.ant-modal-footer').contains('Save').click()

      cy.contains('button', 'Book Metadata').click()
      cy.contains('Hardcover').should('not.exist')
      cy.contains('Paperback').should('not.exist')
      cy.contains('button', ' Add ISBN').should('exist')
    })

    it('checking copyright licenses options', () => {
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

        cy.get(`#${holderName}`).type('University of California', {
          force: true,
        })
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
            cy.get('.ant-collapse-item-active').should(
              'not.contain',
              otherOption,
            )
          }
        })
      })
    })

    it('editing metadata', () => {
      // Edit title page section
      cy.get('#title').clear()

      // Set values using the custom 'setValue' command
      cy.setValue('#title', 'New title')
      cy.setValue('#subtitle', 'New subtitle')
      cy.setValue('#authors', 'Test Author')

      cy.contains('button', ' Add ISBN').click()
      cy.setValue('#isbns_0_label', 'Paperback')
      cy.setValue('#isbns_0_isbn', '978-3-16-148410-0')
      cy.setValue(
        '#topPage',
        'Portions of this book are works of fiction. Any references to historical events, real people, or real places are used fictitiously.',
      )
      cy.setValue('#bottomPage', 'www.author-website.com')

      cy.get('.ant-modal-footer').contains('Save').click()
      cy.contains('button', 'Book Metadata').click()

      // Verify values using the custom 'verifyValue' command
      cy.verifyValue('#title', 'New title')
      cy.verifyValue('#subtitle', 'New subtitle')
      cy.verifyValue('#authors', 'Test Author')
      cy.verifyValue('#isbns_0_label', 'Paperback')
      cy.verifyValue('#isbns_0_isbn', '978-3-16-148410-0')
      cy.verifyValue(
        '#topPage',
        'Portions of this book are works of fiction. Any references to historical events, real people, or real places are used fictitiously.',
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
})
