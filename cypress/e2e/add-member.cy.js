/* eslint-disable jest/no-commented-out-tests */
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
    cy.login()
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
