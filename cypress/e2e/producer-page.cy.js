/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable-line cypress/unsafe-to-chain-command */

const { admin } = require('../support/credentials')

describe('Checking Producer Page', () => {
  before(() => {
    cy.login(admin)
    cy.addBook('Test Book')
    cy.addBook('AI Book')
    cy.logout()
  })

  context('Checking Left Side Panel', () => {
    beforeEach(() => {
      cy.login(admin)
      cy.contains('Test Book').click()
      cy.url().should('include', '/producer')
      cy.getByData('producer-bookTitle').should('contain', 'Test Book')
    })

    it('checking content in left side panel', () => {
      cy.getByData('producer-metadata-btn')
        .should('be.visible')
        .should('not.be.disabled')

      cy.contains('div', 'Book Body')

      cy.get('button[title="Upload a chapter"]').should('exist')
      cy.get('button[title="Create a chapter"]').should('exist')
      cy.getByData('producer-chapterTitle').should(
        'have.text',
        'Untitled Chapter',
      )
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
      cy.get('.ProseMirror').click()
      cy.get('[aria-controls="block-level-options"]').click()
      cy.get(`#block-level-options > :nth-child(${1})`)
        .contains('Title')
        .click({
          timeout: 5000,
          force: true,
        })
      cy.get('h1').type('Title of chapter 1', { delay: 100 })

      // deleting a chapter
      cy.contains('[data-test="producer-chapterTitle"]', 'Title of chapter 1')
        .parent()
        .parent()
        .find('[data-test="producer-more-btn"]')
        .click()
      cy.getByData('producer-deleteChapter').click({ force: true })
      cy.contains('Create or select a chapter on the left to start writing.', {
        timeout: 8000,
      }).should('exist')
    })

    it('adding and deleting a part', () => {
      cy.url().should('include', '/producer')
      cy.createUntitledChapter()
      cy.get('.ProseMirror').click()
      cy.get('[aria-controls="block-level-options"]').click()
      cy.get(`#block-level-options > :nth-child(${1})`)
        .contains('Title')
        .click({
          timeout: 5000,
          force: true,
        })
      cy.get('h1').type('Part 1', { delay: 100 })

      // Converting chapter to a part
      cy.contains('div', 'Part 1', { timeout: 6000 })
        .parent()
        .parent()
        .find('[data-test="producer-more-btn"]')
        .click()
      cy.contains('button', 'Convert to part').click({ force: true })

      cy.contains('Part 1').should('have.attr', 'data-status', '200')
      cy.contains('Part 1')
        .parent()
        .parent()
        .find('[data-test="producer-more-btn"]')
        .click({ force: true })
      cy.contains('button', 'Convert to chapter').should('exist')

      // Add another chapter and try to dnd in part
      cy.get('.anticon-plus').click()
      cy.contains('Untitled Chapter')
        .parent()
        .should('have.attr', 'data-selected', 'true')
      cy.get('.ProseMirror').click()
      cy.get('.ProseMirror').type('Chapter 1')
      cy.get('[aria-controls="block-level-options"]').click()
      cy.get(`#block-level-options > :nth-child(${1})`)
        .contains('Title')
        .click({
          timeout: 5000,
          force: true,
        })

      cy.contains('Chapter 1').dragAndDrop(
        ':nth-child(2) > .ChapterItem__Chapter-sc-qfks8y-2 > .ChapterItem__InnerWrapper-sc-qfks8y-1 > .anticon-holder',
        '[style="display: flex; flex-direction: column;"] > :nth-child(1)',
      )

      // deleting a part
      cy.contains('Part 1')
        .parent()
        .parent()
        .find('[data-test="producer-more-btn"]')
        .click({ force: true })
      cy.getByData('producer-deleteChapter').first().click({ force: true })
      cy.contains('Chapter 1')
        .parent()
        .parent()
        .find('[data-test="producer-more-btn"]')
        .click({ force: true })
      cy.getByData('producer-deleteChapter').last().click({ force: true })
      cy.contains('Create or select a chapter on the left to start writing.', {
        timeout: 8000,
      }).should('exist')
    })

    it.skip('checking drag and drop', () => {
      const chapters = ['Chapter 1', 'Chapter 2', 'Chapter 3']

      chapters.forEach((chapter, index) => {
        cy.createChapter(chapter)
        cy.get(`div[data-part="false"]:nth(${index})`).should(
          'contain',
          chapter,
        )
      })

      // cy.contains('Chapter 1').dragAndDrop(
      //   ':nth-child(1) > .ChapterItem__Chapter-sc-qfks8y-0 > .anticon-holder',
      //   'div:nth(58)',
      // ) // moving chapter 1 below chapter 3
      cy.contains('Chapter 1').dragAndDrop(
        'svg[data-icon="holder"]:nth(0)',
        'div:nth(67)',
      )

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
      cy.getByData('producer-bookTitle').should('contain', 'Test Book')
      cy.getByData('producer-metadata-btn').click()
      cy.getByData('producer-metadata-btn').should(
        'have.attr',
        'aria-pressed',
        'true',
      )
      cy.contains('h1', 'Book Metadata').should('exist')
    })

    it('checking the content in metadata modal', () => {
      cy.contains(
        'p',
        "This information will be used for optional front matter pages. View these pages in the book's preview.",
      )

      // Checking default values for cover page section
      cy.get('h2').first().should('have.text', 'Cover page')
      cy.get('[title="Upload cover image"]').should(
        'have.text',
        'Upload cover image',
      )
      cy.get('input[type="file"]').should('exist')

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
      cy.get('h2:nth(1)').should('have.text', 'Title page')
      cy.get('#title').should('have.value', 'Test Book')
      checkDefaultFieldValues('Subtitle', '#subtitle', 'Optional')
      checkDefaultFieldValues('Authors', '#authors', 'Jhon, Smith')

      // Checking default values for copyright page section
      cy.get('h2').last().should('have.text', 'Copyright page')
      cy.get('label[title="ISBN List"]').should('have.text', 'ISBN List')
      cy.getByData('metadata-addIsbn-btn')
        .should('exist')
        .and('not.be.disabled')
        .click({ force: true })

      cy.get('body').then($body => {
        if ($body.find('#isbns_0_label').length === 0) {
          // Retry clicking the button if the label is not found
          cy.getByData('metadata-addIsbn-btn').click({ force: true })
        }
      })

      cy.get('#isbns_0_label', { timeout: 6000 })
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
      cy.contains('Copyright page').should('exist')
      // Adding the first ISBN
      cy.getByData('metadata-addIsbn-btn').click()

      cy.get('body').then($body => {
        if ($body.find('#isbns_0_label').length === 0) {
          // Retry clicking the button if the label is not found
          cy.getByData('metadata-addIsbn-btn').click({ force: true })
        }
      })

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
      cy.get('#title').click()

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
      cy.get('#title').click()

      // Adding non numeric characters to ISBN is not allowed
      cy.contains('ISBN is invalid').should('exist')
      cy.get('#isbns_1_isbn').clear()
      cy.get('#isbns_1_isbn').type('978-3-16-148540-0')
      cy.contains('ISBN is required').should('not.exist')
      cy.get('#title').click()

      // Removing ISBNs
      cy.get('[aria-label="minus-circle"]:nth(0)').should('exist')
      cy.get('[aria-label="minus-circle"]:nth(1)').should('exist')
      cy.get('[aria-label="minus-circle"]:nth(0)').click()
      cy.get('[aria-label="minus-circle"]:nth(0)').click()
      cy.get('#title').click()

      cy.contains('Hardcover').should('not.exist')
      cy.contains('Paperback').should('not.exist')
      cy.getByData('metadata-addIsbn-btn').should('exist')
    })

    it('checking copyright licenses options', () => {
      cy.contains('Copyright page').should('exist')

      function selectLicenseOption(index, holderName, year) {
        cy.get(`strong:nth(${index})`).click({ force: true })
        cy.get(`strong:nth(${index})`).click({ force: true })

        cy.get(`#${holderName}`).should('be.empty')
        cy.get(`#${holderName}_help`).should(
          'contain',
          'Copyright holder name is required',
        )

        cy.get(`#${year}`)
          .should('have.attr', 'placeholder', 'Select year')
          .should('be.empty')
        cy.get(`#${year}_help`).should('contain', 'Copyright year is required')

        cy.get(`#${holderName}`).type('University of California')
        cy.get(`#${year}`).type('2019{enter}', { force: true })

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
      cy.get('#title').type('{selectall}')
      cy.get('#title').clear()

      // Set values using the custom 'setValue' command
      cy.setValue('#title', 'New title')
      cy.setValue('#subtitle', 'New subtitle')
      cy.setValue('#authors', 'Test Author')

      cy.getByData('metadata-addIsbn-btn').click()
      cy.get('#isbns_0_label').clear()
      cy.setValue('#isbns_0_label', 'Paperback')
      cy.get('#isbns_0_isbn').clear()
      cy.setValue('#isbns_0_isbn', '978-3-16-148410-0')
      cy.setValue(
        '#topPage',
        'Portions of this book are works of fiction. Any references to historical events, real people, or real places are used fictitiously.',
      )
      cy.setValue('#bottomPage', 'www.author-website.com')
      cy.get('#title').click()

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

  context('Book Settings & AI', () => {
    beforeEach(() => {
      cy.login(admin)
      cy.contains('AI Book').click()
      cy.url().should('include', '/producer')
      cy.getByData('producer-bookTitle').should('contain', 'AI Book')
    })

    it('checking editor toolbar and book settings when AI is off', () => {
      cy.get('button[title="Toggle Ai"]').should('not.exist')

      // Confirm default values for Book Settings
      cy.openBookSettings()
      cy.contains('AI writing prompt use').should('exist')
      cy.contains(
        'Users with edit access to this book can use AI writing prompts',
      ).should('exist')
      cy.getByData('settings-toggleAI-switch')
        .should('have.attr', 'aria-checked')
        .and('equal', 'false')
      cy.get('[data-icon="close"]').click()
    })

    it('switching AI to on', () => {
      //   Enable AI
      cy.openBookSettings()
      cy.getByData('settings-toggleAI-switch').click()
      cy.getByData('settings-toggleAI-switch')
        .should('have.attr', 'aria-checked')
        .and('equal', 'true')
      cy.getByData('settings-save-btn').click()
      cy.get('button[title="Toggle Ai"]')
        .should('exist')
        .should('have.attr', 'aria-pressed')
        .and('equal', 'false')

      cy.get('.ProseMirror').type('Add a paragraph{selectall}')

      cy.get('button[title="Toggle Ai"]').should('not.be.disabled')

      cy.get('button[title="Toggle Ai"]').click({ force: true })

      // cy.usingAIPrompt()

      // cy.get('input[id="askAiInput"]')
      //   .should('have.attr', 'placeholder')
      //   .and('eq', 'How can I help you? Type your prompt here.')

      // cy.get('input[id="askAiInput"]')
      //   .should('be.visible')
      //   .then($input => {
      //     // Focus on the input field explicitly
      //     cy.wrap($input).focus()
      //     cy.wrap($input).type('Replace this with a familiar sentence {enter}')
      //   })

      // /* eslint-disable cypress/no-unnecessary-waiting */
      // cy.wait(10000)
      // cy.contains('Try again').click()
      // /* eslint-disable cypress/no-unnecessary-waiting */
      // cy.wait(10000)
      // cy.contains('Discard').click()
      // cy.get('input[id="askAiInput"]')
      //   .parent()
      //   // .click()
      //   .type('Replace this with a familiar sentence {enter}')
      // /* eslint-disable cypress/no-unnecessary-waiting */
      // cy.wait(10000)
      // cy.contains('Replace selected text').click()
      // cy.contains('Add a paragraph').should('not.exist')
    })
  })
  context('Adding and deleting comments', () => {
    beforeEach(() => {
      cy.login(admin)
      cy.contains('AI Book').click()
      cy.url().should('include', '/producer')
      cy.getByData('producer-bookTitle').should('contain', 'AI Book')
    })

    it('writing and resolving a comment', () => {
      cy.get('.ProseMirror').should('be.visible')
      cy.wait(5000)
      cy.get('.ProseMirror').type('{selectall}{backspace}')
      cy.get('.ProseMirror').type(
        'This text is going to be commented.{enter}{selectall}',
      )
      cy.get('[xmlns="http://www.w3.org/2000/svg"]').last().click()
      cy.get('[placeholder="Write comment..."]').should('exist')
      cy.get('button[type="submit"]')
        .should('have.text', 'Post')
        .should('be.disabled')
      cy.contains('button', 'Cancel').should('be.disabled')

      // Add a comment
      // cy.get('textarea[placeholder="Write comment..."]').type(
      //   'This is a comment from the author.',
      // )
      cy.get('[placeholder="Write comment..."]')
        .should('exist')
        .and('be.visible')
        .focused()
        .type('This is a comment from the author.')

      cy.get('button[type="submit"]').should('be.enabled')
      cy.get('button[type="submit"]').click()

      cy.verifyComment('Admin Adminius', 'This text is going to be commented.')
      cy.contains('span', 'This text is going to be commented.').should(
        'have.class',
        'comment',
      )
      // Replying to comment
      cy.get('textarea[placeholder="Reply..."]').type(
        'This is a reply from the author.{enter}',
      )
      cy.get('textarea[placeholder="Reply..."]').should('be.enabled').type('@')
      cy.contains('Not Found').should('exist')
      cy.contains('button', 'Cancel').click()

      // Resolving a comment
      cy.contains('button', 'Resolve').click()
      cy.get('p').first().should('not.have.class', 'comment')
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

Cypress.Commands.add('usingAIPrompt', () => {
  cy.wait(6000)
  cy.get('.ProseMirror', { timeout: 10000 }).type('Add a paragraph{selectall}')
  cy.get('button[title="Toggle Ai"]').should('not.be.disabled')
  cy.get('button[title="Toggle Ai"]').click({ force: true })

  cy.get('input[id="askAiInput"]')
    .should('have.attr', 'placeholder')
    .and('eq', 'How can I help you? Type your prompt here.')

  cy.get('input[id="askAiInput"]').as('askAiInput')

  cy.get('@askAiInput')
    .should('be.visible')
    .then($input => {
      // Explicitly focus on the input field
      cy.wrap($input)
        // .focus()
        .type('Replace this with a similiar sentence {enter}', { delay: 100 })
    })

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

  cy.contains('Replace selected text', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains('Add a paragraph').should('not.exist')
})
Cypress.Commands.add('verifyComment', (commentAuthor, commentText) => {
  cy.contains(commentAuthor).should('exist')
  cy.contains('a few seconds ago').should('exist')
  cy.contains(commentText).should('exist')
  cy.get('textarea[placeholder="Reply..."]').should('exist')
})
