/* eslint-disable jest/expect-expect */
/* eslint-disable jest/no-commented-out-tests */
const {
  admin,
  author,
  collaborator1,
  collaborator2,
} = require('../support/credentials')

describe('Checking "Add members" modal', () => {
  before(() => {
    cy.signup(author)
    cy.signup(collaborator1)
    cy.signup(collaborator2)
    cy.login(admin)
    cy.addBook('Test Book')
    cy.logout()
  })
  beforeEach(() => {
    cy.login(admin)
    cy.goToBook('Test Book')
  })

  it('checking the defaults of the modal', () => {
    cy.contains('button', 'Book Members')
      .should('exist')
      .should('not.be.disabled')
      .click()

    cy.get('[data-icon="question-circle"]')
      .parent()
      .siblings()
      .should('contain', 'Book members')

    cy.contains('Email, comma separated').should('exist')
    cy.get('.ant-select-selection-item').should(
      'have.attr',
      'title',
      'Can view',
    )

    cy.get('.ant-select-selection-item').click()
    cy.get('[role="option"]:nth(0)').should('contain', 'Can view').click()
    cy.get('[role="option"]:nth(1)').should('contain', 'Can edit')
    cy.get('button[type="submit"]')
      .should('be.disabled')
      .should('contain', 'Add user')

    cy.get('.ant-list-item').should('have.text', 'AAAdmin AdminiusOwner')

    cy.get('[data-icon="question-circle"]').should('exist').trigger('mouseover')
    cy.get('.ant-tooltip-inner').contains(
      'Only the book owner can add team members who are already signed up on the system, and can determine their permissions. Collaborators with Edit access can change book content or metadata and view export previews, but cannot download PDF or Epub files. Collaborators with View access cannot change book content or metadata or download PDF or Epub files, but can view export previews.',
    )
  })

  it('checking "Add user" button is disabled if user types in an incorrect email', () => {
    cy.contains('button', 'Book Members').click()
    cy.contains('Add user').should('be.disabled')

    cy.log('author.10@example.com does not exist')
    cy.get('.ant-select-selection-overflow').type(
      'author.10@example.com{enter}',
    )
    cy.get('div[role="option"]').should('not.exist')
    cy.contains('Add user').should('be.disabled')

    cy.log('author.1@example.com exists')
    cy.get('.ant-select-selection-overflow').type(author.email)
    cy.get('div[role="option"]').click()

    cy.get('.ant-select-selection-overflow').should(
      'contain',
      author.name,
      author.surname,
    )
    cy.contains('Add user').should('not.be.disabled')
  })

  it('adding a single user and changing permissions', () => {
    cy.contains('button', 'Book Members').click()
    cy.contains('Add user').should('be.disabled')

    cy.get('.ant-select-selection-overflow').type(author.email)
    cy.get('div[role="option"]').click()

    cy.get('.ant-select-selection-overflow').should(
      'contain',
      author.name,
      author.surname,
    )
    cy.contains('Add user').should('not.be.disabled')

    // default permission is Can view
    cy.contains('Can view').click()

    // changing permission to Can edit
    cy.contains('Can edit').click()
    cy.contains('Add user').click()

    cy.get('.ant-list-item').should('contain', 'A1', 'Author 1', 'Can edit')

    cy.get('.ant-list-item').contains('Can edit').click()
    cy.get('[role="option"]:nth(0)').should('have.text', 'Can view')
    cy.get('[role="option"]:nth(1)').should('have.text', 'Can edit')
    cy.get('[role="option"]:nth(2)').should('have.text', 'Remove access')

    cy.log('changing permission to Can view')
    cy.get('[role="option"]:nth(0)').click()
    cy.get('.ant-list-item').contains('Can view')

    // deleting this user
    cy.get('.ant-list-item').contains('Can view').click({ force: true })
    cy.get('[role="option"]:nth(2)')
      .should('have.text', 'Remove access')
      .click({ force: true })
  })

  it('removing a collaborator', () => {
    cy.contains('button', 'Book Members').click()

    cy.log('Adding a user with view permission')
    cy.get('.ant-select-selection-overflow').type(collaborator1.email)
    cy.get('div[role="option"]').click()
    cy.contains('Add user').click()

    cy.get('.ant-list-item').should(
      'contain',
      'C1',
      'Collaborator 1',
      'Can view',
    )

    cy.log('Removing acess for user')
    cy.get('.ant-list-item').contains('Can view').click()
    cy.get('[role="option"]:nth(2)')
      .should('have.text', 'Remove access')
      .click()
    cy.contains('Collaborator 1').should('not.exist')
  })

  it('check that changes are saved when closing the modal', () => {
    cy.contains('button', 'Book Members').click()

    cy.log('Adding a user with view permission')
    cy.get('.ant-select-selection-overflow').type(collaborator1.email)
    cy.get('div[role="option"]').click()
    cy.contains('Add user').click()

    cy.get('.ant-list-item').should(
      'contain',
      'C1',
      'Collaborator 1',
      'Can view',
    )
    // closing the modal
    cy.get('.ant-modal-close').click()

    // reopening the modal
    cy.contains('button', 'Book Members').click()
    cy.get('.ant-list-item').should(
      'contain',
      'C1',
      'Collaborator 1',
      'Can view',
    )
    // deleting collaborator
    cy.log('Removing acess for user')
    cy.get('.ant-list-item').contains('Can view').click()
    cy.get('[role="option"]:nth(2)')
      .should('have.text', 'Remove access')
      .click()

    // closing the modal
    cy.get('.ant-modal-close').click()

    // reopening the modal
    cy.contains('button', 'Book Members').click()
    cy.contains(collaborator1.name, collaborator1.surname).should('not.exist')
  })

  it('adding multiple members at once', () => {
    cy.contains('button', 'Book Members').click()

    cy.get('.ant-select-selection-overflow').type(collaborator1.email)
    cy.get('div[role="option"]')
      .should('contain', collaborator1.name, collaborator1.surname)
      .click({ timeout: 5000 })

    cy.get('.ant-select-selection-overflow').type(collaborator2.email)
    cy.get('div[role="option"]')
      .should('contain', collaborator2.surname)
      .click({ timeout: 8000 })
    cy.contains('Add user').click({ force: true })

    cy.get('.ant-list-item').should(
      'contain',
      collaborator1.name,
      collaborator1.surname,
      collaborator2.name,
      collaborator2.surname,
    )
  })
})
/*

describe('add multiple members', () => {
  beforeEach(() => {})

  it.skip('creating new users', () => {
    for (let i = 1; i <= 150; i++) {
      const surname = i
      const email = `author.${surname}@example.com`

      cy.visit('http://localhost:4000/signup')
      //   cy.getByData('givenName-input').type('Author')
      //   cy.getByData('surname-input').find('input').type(`${surname}`)
      //   cy.getByData('email-input').type(`${email}`)
      //   cy.getByData('password-input').type('password')
      //   cy.getByData('confirmPassword-input').type('password')
      //   cy.getByData('agreedTc').find("[type='checkbox']").click()
      //   cy.getByData('agreedTc').find("[type='checkbox']").click()
      cy.get('#givenNames').type('Author')
      cy.get('#surname').type(`${surname}`)
      cy.get('#email').type(`${email}`)
      cy.get('#password').type('password')
      cy.get('#confirmPassword').type('password')
      cy.get('#agreedTc').click()
      cy.get('button[type="submit"]').contains('Sign up').click()
      cy.get('h1').should('have.text', 'Sign up')
      cy.get('div[role="alert"]').should(
        'have.text',
        "Sign up successful!We've sent you a verification email. Click on the link in the email to activate your account.",
      )

      cy.get('div[role="alert"]').contains(
        "We've sent you a verification email. Click on the link in the email to activate your account.",
      )
    }
  })

  // TO RUN THE NEXT STEP, IT IS NECCESSARY TO VERIFY THE USERS CREATED ABOVE

  it.skip('adding collaborators', () => {
    cy.login(admin)
    cy.contains('1').click()
    cy.contains('Book Members').click()

    for (let i = 1; i <= 150; i++) {
      const surname = i
      const email = `author.${surname}@example.com`
      // cy.get('input[type="search"]', {force: true}).first().type(`${email}`)
      cy.get('.ant-select-selection-overflow-item').type(`${email}`)
      cy.contains(`Author ${surname}`).click()
      cy.contains('Add user').click().wait(5000)
    }
  })
})
*/
