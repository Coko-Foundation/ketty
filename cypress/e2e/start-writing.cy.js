/* eslint-disable jest/no-commented-out-tests */
/* eslint-disable jest/expect-expect */
const { admin } = require('../support/credentials')

describe('Start writing', () => {
  beforeEach(() => {
    cy.login(admin)
  })

  it('creating a book by clicking "Start writing" button', () => {
    // cy.getByData('start-writing-button')
    cy.get('button:nth(1)')
      .should('have.text', 'Start writing your book')
      .click()

    // cy.getByData('book-title-input')
    cy.get('#bookTitle')
      .invoke('attr', 'placeholder')
      .should('contain', 'Book title')

    cy.get('form')
      .find('p')
      .should(
        'have.text',
        "Don't overthink it, you can change your title at any time",
      )

    cy.get('form')
      .find('button')
      .should('have.text', 'Continue')
      .should('be.disabled')

    cy.get('#bookTitle').type('Book One')

    cy.get('form').find('button').should('have.text', 'Continue').click()
    cy.contains('Book One').click()
    cy.contains('Book Metadata')
    cy.contains('Book One')

    // Adding a chapter
    cy.get('.anticon-plus').click()
    cy.contains('Untitled Chapter').click()
    cy.get('[title="Change to Title"]').click()
    cy.get('h1').type('Title of chapter 1')

    // Going back to dashboard
    cy.get("a[href='/dashboard']").last().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.log('Confirms that book exists in the dashboard')
    cy.get('.ant-card-body').contains('Book One')
  })

  it('verifying enter key is working correctly in title page', () => {
    cy.get('button:nth(1)')
      .should('have.text', 'Start writing your book')
      .click()

    cy.get('#bookTitle').type('00 Test Book{enter}')
    cy.contains('Book Metadata')
    cy.contains('00 Test Book')

    cy.get("a[href='/dashboard']").last().click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.log('Confirms that book exists in the dashboard')
    cy.get('.ant-card-body').contains('00 Test Book')
  })
})

/*
describe('Adding many books quickly', () => {
  beforeEach(() => {
    cy.login(admin)
  })

  it('adding 100 books by clicking "start writing" button', () => {
    for (let i = 1; i <= 100; i++) {
      cy.contains('Start writing your book').click()
      cy.contains("Don't overthink it, you can change your title at any time")
      cy.log(`Book ${i} was created`)
      cy.get('a[href="/dashboard"]').last().click()
      cy.location('pathname').should('equal', '/dashboard')
    }
  })
})
*/
