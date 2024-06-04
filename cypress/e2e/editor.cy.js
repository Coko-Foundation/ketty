/* eslint-disable jest/expect-expect */
const { admin } = require('../support/credentials')

describe('Book editor', () => {
  let display
  let listItems
  let levels
  before(() => {
    cy.fixture('book-content').then(bookContent => {
      display = [
        {
          button: "[title='Toggle strong']",
          element: 'strong',
          content: bookContent.bold,
        },
        {
          button: "[title='Toggle emphasis']",
          element: 'em',
          content: bookContent.emphasis,
        },
        {
          button: "[title='Toggle underline']",
          element: 'u',
          content: bookContent.underline,
        },
      ]
      listItems = ['item1', 'item2', 'item3']
      levels = [
        {
          title: 'Title',
          element: 'h1',
          content: bookContent['title-h1'],
        },
        {
          title: 'Heading 2',
          element: 'h2',
          content: bookContent['heading-2'],
        },
        {
          title: 'Heading 3',
          element: 'h3',
          content: bookContent['heading-3'],
        },
        {
          title: 'Paragraph',
          element: '.paragraph',
          content: bookContent.paragraph,
        },
        {
          title: 'Block Quote',
          element: 'blockquote',
          content: bookContent['block-quote'],
        },
      ]
    })
    cy.login(admin)
    cy.addBook('Test Book')
    cy.logout()
  })
  beforeEach(() => {
    cy.login(admin)
    cy.goToBook('Test Book')
  })

  it('Adding content', () => {
    // cy.get('.anticon-plus').click()
    // cy.contains('Untitled Chapter', { timeout: 8000 }).click()

    let i = 1
    levels.forEach(option => {
      cy.get('[aria-controls="block-level-options"]').click() // Click the Dropdown-control at the current index
      cy.get(`#block-level-options > :nth-child(${i})`)
        .contains(option.title)
        .click({
          timeout: 5000,
          force: true,
        }) // Find and click the option with the specific content within the Dropdown-menu
      cy.get('.ProseMirror').type(`${option.content}{enter}`)
      i += 1
    })
    cy.get('.ProseMirror').type('{enter}')

    display.forEach(option => {
      cy.get(option.button, { timeout: 8000 }).click({
        timeout: 5000,
        force: true,
      })
      cy.get('.ProseMirror').type(`${option.content}{enter}`)
    })

    // // Adding ordered list
    // cy.get("[title='Wrap in ordered list']").click()
    // listItems.forEach(li => {
    //   cy.get('.ProseMirror').type(`${li}{enter}`)
    // })
    // cy.get('.ProseMirror').type('{enter}')

    // // Adding Bullet list
    // cy.get("[title='Wrap in bullet list']").click()

    // listItems.forEach(li => {
    //   cy.get('.ProseMirror').type(`${li}{enter}`)
    // })
    // cy.get('.ProseMirror').type('{enter}')
    // Add ordered list
    cy.addList('ordered', listItems)

    // Add bullet list
    cy.addList('bullet', listItems)
  })

  it('Verifying content', () => {
    // cy.contains('Test Chapter').click()

    display.forEach(option => {
      cy.contains(option.element, option.content, { timeout: 8000 })
    })

    cy.get('ul>li>.paragraph').each(($el, index) => {
      cy.get($el).should('contain', listItems[index], { timeout: 8000 })
    })

    cy.get('ol>li').each(($el, index) => {
      cy.get($el)
      cy.contains(listItems[index])

      levels.forEach(option => {
        cy.contains(option.element, option.content, { timeout: 8000 })
      })
    })
  })

  it('Checking redo and undo', () => {
    // cy.contains('Test Chapter').click()
    const addedText = 'I added this text.'
    cy.get('.ProseMirror').type(`${addedText}{enter}`)
    cy.contains(addedText).should('exist')
    cy.get('button[title="Undo"]').click()
    cy.contains(addedText).should('not.exist')
    cy.get('button[title="Redo"]').click()
    cy.contains(addedText).should('exist')
  })

  it('Checking adding links', () => {
    cy.createUntitledChapter()
    cy.get('button[title="Add or remove link"]').should('be.disabled')
    cy.get('.ProseMirror').type('Some link{selectall}')

    cy.get('button[title="Add or remove link"]').should('not.be.disabled')
    cy.get('button[title="Add or remove link"]').click({ force: true })

    cy.addLink('www.examplelink.com')

    cy.contains('button', 'Edit').should('exist')
    cy.contains('button', 'Remove').should('exist')
    cy.contains('button', 'Edit').click()
    cy.get('input').last().clear()

    cy.addLink('www.examplelink-edited.com')
  })

  it('Checking lifting out of enclosing blocks', () => {
    // cy.contains('Test Chapter').click()

    // adding a code block
    cy.get('.ProseMirror').type(`This is an enclosed block`)
    cy.get('[aria-controls="block-level-options"]').click()
    cy.get(`#block-level-options > :nth-child(5)`)
      .contains(levels[4].title)
      .click({
        force: true,
      })

    cy.contains(levels[4].element, 'This is an enclosed block')

    cy.get('button[title="Lift out of enclosing block"]').click()
    cy.contains(levels[4].element, 'This is an enclosed block').should(
      'not.exist',
    )
  })

  it('Checking adding special characters', () => {
    // cy.contains('Test Chapter').click()

    cy.get('.ProseMirror').type(
      '{Enter}The following are some special characters:{enter}',
    )
    cy.get('button[title="Special Characters"]').click()

    const specialCharacters = ['Vowels', 'Consonants', 'Latin', 'Math', 'Misc']

    cy.clickSpecialCharacterSection()

    specialCharacters.forEach(character => {
      cy.contains(character)
    })

    cy.get('input[placeholder="Search"]').type('Sum')

    cy.clickSpecialCharacterSection()
      .find('[title="N-ary summation"]', { timeout: 8000 })
      .should('exist')
      .click({ force: true })

    cy.get('.ProseMirror').contains('∑')

    cy.clickSpecialCharacterSection()
    cy.get('input[placeholder="Search"]').clear()
    cy.get('input[placeholder="Search"]').type('copyright')
    cy.clickSpecialCharacterSection()
      .find('[title="Copyright"]', { timeout: 8000 })
      .should('exist')
      .click({ force: true })

    cy.get('.ProseMirror').contains('©')
  })

  it('Checking find and replace', () => {
    cy.contains('Untitled Chapter').click()
    cy.get('.ProseMirror').clear()
    cy.get('.ProseMirror').type(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac mi nibh. Morbi metus tortor, tincidunt nec finibus ac, posuere varius libero. Maecenas vitae dignissim diam. Proin bibendum leo sit amet sem mollis, ut maximus tortor dignissim.',
    )
    cy.get('button[title="Find And Replace"]').click()
    cy.get('input[placeholder="Find"]').should('exist')
    cy.verifySearchResultCount('0 of 0')
    cy.get('[role="button"]:nth(0)').contains('Match Case')
    cy.get('[role="button"]:nth(1)').contains('Previous')
    cy.get('[role="button"]:nth(2)').contains('Next')

    // Checking results
    cy.log('checking search results for letter M')
    cy.get('input[placeholder="Find"]').type('M')
    cy.verifySearchResultCount('0 of 16')
    cy.clickButtonInFind('Match Case')
    cy.verifySearchResultCount('0 of 2')

    cy.clickButtonInFind('Next')
    cy.verifySearchResultCount('0 of 2')
    cy.clickButtonInFind('Next')
    cy.verifySearchResultCount('1 of 2')
    cy.clickButtonInFind('Next')
    cy.verifySearchResultCount('2 of 2')
    cy.clickButtonInFind('Previous')
    cy.verifySearchResultCount('1 of 2')
    cy.clickButtonInFind('Match Case') // Untoggle "match case"

    cy.get('input[placeholder="Find"]').clear()
    cy.clickButtonInFind('Match Case')
      .siblings()
      .contains('more')
      .click({ force: true })

    // checking the replace section
    cy.contains('Find& Replace').should('exist')
    cy.contains('Find& Replace').siblings().contains('Close').should('exist')

    cy.get('input[id="search-input"]').should(
      'have.attr',
      'placeholder',
      'Something is this doc',
    )
    cy.contains('Replace with')
    cy.get('input[placeholder="Replace text"]').should('exist')
    // cy.get('input[id="case-sensitive"]').should('not.have.attr', 'checked')
    cy.contains('button', 'Replace').should('exist')
    cy.contains('button', 'Replace All').should('exist')

    // Replacing the first "M"
    cy.contains('Morbi').should('exist')
    cy.contains('Torbi').should('not.exist')
    cy.get('input[id="search-input"]').type('M')
    cy.get('input[id="case-sensitive"]').uncheck({ force: true })
    cy.verifySearchResultCount('5 of 16')
    cy.get('input[id="case-sensitive"]').check({ force: true })
    cy.verifySearchResultCount('1 of 2')
    cy.get('input[placeholder="Replace text"]').type('T')
    cy.contains('button', 'Replace').click()
    cy.verifySearchResultCount('1 of 1')
    cy.contains('Torbi').should('exist')
  })

  it('Checking uploading images', () => {
    // cy.contains('Test Chapter').click()

    cy.get('.ProseMirror').type('{enter}Next an image will be added. {enter}')
    cy.get('input[id="file-upload"]').selectFile(
      'cypress/fixtures/images/Image1.jpg',
      {
        force: true,
      },
    )

    // Checking if the image exists in Editor
    cy.get('figure', { timeout: 10000 }).should('exist')
    cy.get('figure').last().click()
    cy.get('input[placeholder="Alt Text"]').type('some alternative text')
    cy.get('figcaption').type('Caption of the first image')
  })

  it('Checking fullscreen', () => {
    // cy.contains('Test Chapter').click()
    cy.get('button[title="Full screen"]').click()
    cy.contains('Book Metadata').should('not.exist')

    cy.get('button[title="Exit full screen"]').click()
    cy.contains('Book Metadata').should('exist')
  })
})

Cypress.Commands.add('clickSpecialCharacterSection', () => {
  cy.get('input[placeholder="Search"]').should('exist').parent().parent()
})

Cypress.Commands.add('verifySearchResultCount', count => {
  cy.get('input:nth(1)').siblings().should('contain', count)
})

Cypress.Commands.add('addLink', link => {
  cy.contains('button', 'Apply').should('exist')
  cy.contains('button', 'Cancel').should('exist')
  cy.get('input').last().type(link)
  cy.contains('button', 'Apply').click()
})

Cypress.Commands.add('clickButtonInFind', buttonText => {
  switch (buttonText) {
    case 'Match Case':
      cy.get('[role="button"]:nth(0)').click()
      break
    case 'Previous':
      cy.get('[role="button"]:nth(1)').click()
      break
    case 'Next':
      cy.get('[role="button"]:nth(2)').click()
      break
    default:
      throw new Error(`Unsupported button parameter: ${buttonText}`)
  }
})

Cypress.Commands.add('addList', (listType, listItems) => {
  cy.get(`[title='Wrap in ${listType} list']`).click()
  listItems.forEach(li => {
    cy.get('.ProseMirror').type(`${li}{enter}`)
  })
  cy.get('.ProseMirror').type('{enter}')
})
