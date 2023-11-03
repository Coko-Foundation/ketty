/* eslint-disable jest/expect-expect */

describe('Book editor', () => {
  let display
  let listItems
  let levels
  before(() => {
    cy.fixture('book-content').then(bookContent => {
      display = [
        {
          button: "[title='Change to Title']",
          element: 'h1',
          content: bookContent['title-h1'],
        },
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
    cy.login()
    cy.addBook('Test Book')
    cy.logout()
  })
  beforeEach(() => {
    cy.login()
    cy.goToBook('Test Book')
  })

  it('Adding content', () => {
    cy.get('.anticon-plus').click()
    cy.contains('Untitled Chapter').click()

    display.forEach(option => {
      cy.get(option.button, { timeout: 8000 }).click({
        timeout: 5000,
        force: true,
      })
      cy.get('.ProseMirror').type(`${option.content}{enter}`)
    })

    // Adding ordered list
    cy.get("[title='Wrap in ordered list']").click()
    listItems.forEach(li => {
      cy.get('.ProseMirror').type(`${li}{enter}`)
    })
    cy.get('.ProseMirror').type('{enter}')

    // Adding Bullet list
    cy.get("[title='Wrap in bullet list']").click()

    listItems.forEach(li => {
      cy.get('.ProseMirror').type(`${li}{enter}`)
    })
    cy.get('.ProseMirror').type('{enter}')

    let i = 1
    levels.forEach(option => {
      cy.get('.Dropdown-control').click() // Click the Dropdown-control at the current index
      cy.get(`.Dropdown-menu > :nth-child(${i})`).contains(option.title).click({
        timeout: 5000,
        force: true,
      }) // Find and click the option with the specific content within the Dropdown-menu
      cy.get('.ProseMirror').type(`${option.content}{enter}`)
      i += 1
    })
    cy.get('.ProseMirror').type('{enter}')
  })

  it('Verifying content', () => {
    cy.contains('The Test book').click()

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
    cy.contains('The Test book').click()
    const addedText = 'I added this text.'
    cy.get('.ProseMirror').type(`${addedText}{enter}`)
    cy.contains(addedText).should('exist')
    cy.get('button[title="Undo"]').click()
    cy.contains(addedText).should('not.exist')
    cy.get('button[title="Redo"]').click()
    cy.contains(addedText).should('exist')
  })

  // it('Checking adding links', () => {
  //   cy.contains('Test Book').click()
  //   cy.url().should('include', '/producer')
  //   cy.contains('div', 'Test Book')
  //   cy.contains('The Test book').click()
  //   cy.get('button[title="Add or remove link"]').should('be.disabled')
  //   cy.get('.ProseMirror').type(
  //     'This is a link.{shift}{rightArrow}{rightArrow}{rightArrow}{rightArrow}',
  //     { release: false }, )

  //   cy.get('button[title="Add or remove link"]').should('not.be.disabled')
  //   // cy.get('.ProseMirror').type('This is a link.{selectall}')
  //   cy.get('button[title="Add or remove link"]').click({ force: true })
  // })

  it('Checking lifting out of enclosing blocks', () => {
    cy.contains('The Test book').click()

    // adding a code block
    cy.get('.ProseMirror').type(`This is an enclosed block`)
    cy.get('.Dropdown-control').click()
    cy.get(`.Dropdown-menu > :nth-child(${4})`)
      .contains(levels[3].title)
      .click({
        force: true,
      })

    cy.contains(levels[3].element, 'This is an enclosed block')

    cy.get('button[title="Lift out of enclosing block"]').click()
    cy.contains(levels[3].element, 'This is an enclosed block').should(
      'not.exist',
    )
  })

  it('Checking adding special characters', () => {
    cy.contains('The Test book').click()

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

    cy.get('input[placeholder="Search"]').clear()
    cy.get('input[placeholder="Search"]').type('copyright')
    cy.clickSpecialCharacterSection()
      .find('[title="Copyright"]', { timeout: 8000 })
      .should('exist')
      .click({ force: true })

    cy.get('.ProseMirror').contains('©')
  })

  it('Checking find and replace', () => {
    cy.contains('The Test book').click()
    cy.get('button[title="Find And Replace"]').click()
    cy.get('input[placeholder="Find"]').should('exist')
    cy.verifySearchResultCount('0 of 0')
    cy.get('[role="button"]:nth(0)').contains('Match Case')
    cy.get('[role="button"]:nth(1)').contains('Previous')
    cy.get('[role="button"]:nth(2)').contains('Next')

    // Checking results
    cy.log('checking search results for letter T')
    cy.get('input[placeholder="Find"]').type('T')
    cy.verifySearchResultCount('0 of 34')
    cy.get('[role="button"]:nth(0)').click()
    cy.verifySearchResultCount('0 of 9')
    cy.get('[role="button"]:nth(2)').click()
    cy.verifySearchResultCount('2 of 9')
    cy.get('[role="button"]:nth(1)').click()
    cy.verifySearchResultCount('1 of 9')
    cy.get('[role="button"]:nth(0)').click() // Untoggle "match case"

    cy.get('input[placeholder="Find"]').clear()
    cy.get('[role="button"]:nth(0)')
      .siblings()
      .contains('Expand')
      .click({ force: true })

    // checking the replace section
    cy.contains('Find & Replace').should('exist')
    cy.contains('Find & Replace').siblings().contains('Close').should('exist')

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

    // Replacing the first "T"
    cy.get('input[id="search-input"]').type('T')
    cy.verifySearchResultCount('1 of 34')
    cy.get('input[id="case-sensitive"]').check({ force: true })
    cy.verifySearchResultCount('1 of 9')
    cy.get('input[placeholder="Replace text"]').type('W')
    cy.get('[role="button"]:nth(1)').click() // Clicking Next
    cy.get('[role="button"]:nth(0)').click() // Clicking Previous
    cy.contains('button', 'Replace').click()
    cy.verifySearchResultCount('1 of 8')
    cy.contains('Whe Test book').should('exist')
    cy.get('button[title="Undo"]').click()
    cy.contains('The Test book').should('exist')
  })

  it('Checking uploading images', () => {
    cy.contains('The Test book').click()

    cy.get('.ProseMirror').type('{enter}Next an image will be added. {enter}')
    cy.get('input[id="file-upload"]').selectFile(
      'cypress/fixtures/images/Image1.jpg',
      {
        force: true,
      },
    )

    // Checking if the image exists in Editor
    cy.get('figure', { timeout: 5000 }).should('exist')
    cy.get('img').last().click()
    cy.get('input[placeholder="Alt Text"]').type('some alternative text')
    cy.get('figcaption').type('Caption of the first image')
  })

  it('Checking fullscreen', () => {
    cy.contains('The Test book').click()
    cy.get('button[title="full screen"]').click()
    cy.contains('Book Metadata').should('not.exist')

    cy.get('button[title="full screen"]').click() // exit full screen
    cy.contains('Book Metadata').should('exist')
  })
})

Cypress.Commands.add('clickSpecialCharacterSection', () => {
  cy.get('input[placeholder="Search"]').should('exist').parent().parent()
})

Cypress.Commands.add('verifySearchResultCount', count => {
  cy.get('input:nth(1)').siblings().should('contain', count)
})
