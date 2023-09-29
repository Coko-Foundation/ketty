/* eslint-disable jest/expect-expect */
describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000')
  })

  it('allows user to login with admin credentials', () => {
    // cy.getByData('email-input').type('admin@example.com')
    cy.get('#email').type('admin@example.com')
    // cy.getByData('password-input').type('password')
    cy.get('#password').type('password')
    cy.get("button[type='submit']").contains('Log in').click()
    cy.location('pathname').should('equal', '/dashboard')
    // cy.getByData('avatar-initials').should('exist').contains('AA')
    cy.log('Verify initals of admin show in the avatar')
    cy.get('.ant-avatar-string').should('exist').contains('AA')
    cy.get('.ant-avatar-string').click()
    cy.get('li[role="menuitem"]').contains('Logout').click()
    cy.location('pathname').should('equal', '/login')
  })

  it('does NOT allow user to login without providing any credentials', () => {
    cy.get("button[type='submit']").contains('Log in').click()
    cy.location('pathname').should('equal', '/login')
    cy.get('#email_help').contains('Email is required')
    cy.get('#password_help').contains('Password is required')
  })

  it('does NOT allow user to login with a valid username and an invalid password', () => {
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('123')
    cy.get("button[type='submit']").contains('Log in').click()
    cy.location('pathname').should('equal', '/login')
    cy.contains('Invalid credentials')
  })

  it('does NOT allow user to login with invalid email', () => {
    cy.get('#email').type('admin')
    cy.get('#password').type('password')
    cy.get("button[type='submit']").contains('Log in').click()
    cy.location('pathname').should('equal', '/login')
    cy.get('#email_help').contains('This is not a valid email address')
  })

  it('allows user to login by hitting Enter', () => {
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('password{enter}')
    cy.location('pathname').should('equal', '/dashboard')
  })
})

describe('Signup', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000')
    cy.get("a[href='/signup']")
      .contains('Do you want to sign up instead?')
      .click()
    cy.location('pathname').should('equal', '/signup')
  })

  it('does NOT allow user to signup without filling all the fields', () => {
    cy.get('button[type="submit"]').contains('Sign up').click()
    // cy.getByData('givenName-input').contains('Given name is required')
    cy.get('#givenNames_help').contains('Given name is required')
    // cy.getByData('surname-input').contains('Surname is required')
    cy.get('#surname_help').contains('Surname is required')
    // cy.getByData('email-input').contains('Email is required')
    cy.get('#email_help').contains('Email is required')
    // cy.getByData('password-input').contains('Password is required')
    cy.get('#password_help').contains('Password is required')

    // cy.getByData('password-input').contains(
    //   'Password should not be shorter than 8 characters',
    // )

    cy.get('#password_help').contains(
      'Password should not be shorter than 8 characters',
    )

    // cy.getByData('confirmPassword-input').contains(
    //   'Please confirm your password!',
    // )

    cy.get('#confirmPassword_help').contains('Please confirm your password!')

    // cy.getByData('agreedTc').contains(
    //   'You need to agree to the terms and conditions',
    // )
    cy.get('#agreedTc_help').contains(
      'You need to agree to the terms and conditions',
    )

    // Trying to log in without filling all the required fields
    cy.get('#givenNames').type('John')
    cy.get('#surname').type('Smith')
    cy.get('button[type="submit"]').contains('Sign up').click()
    cy.get('#email_help').contains('Email is required')
    cy.get('#password_help').contains('Password is required')
    cy.get('#password_help').contains(
      'Password should not be shorter than 8 characters',
    )
    cy.get('#confirmPassword_help').contains('Please confirm your password!')
    cy.get('#agreedTc_help').contains(
      'You need to agree to the terms and conditions',
    )

    // Verifying warning for passwords that don't match
    cy.get('#email').type('john@example.com')
    cy.get('#agreedTc').click()
    cy.get('#password').type('password')
    cy.get('#confirmPassword').type('123{enter}')
    cy.contains('The two passwords that you entered do not match!')
  })

  it('new user signs up', () => {
    // cy.getByData('givenName-input').type('John')
    cy.get('#givenNames').type('John')
    // cy.getByData('surname-input').find('input').type('Smith')
    cy.get('#surname').type('Smith')
    // cy.getByData('email-input').type('john@example.com')
    cy.get('#email').type('john@example.com')
    // cy.getByData('password-input').type('password')
    cy.get('#password').type('password')
    // cy.getByData('confirmPassword-input').type('password')
    cy.get('#confirmPassword').type('password')
    // cy.getByData('agreedTc').find("[type='checkbox']").click()
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

    cy.visit('http://localhost:4000/login')
    // New user logs in
    // Check avatar for the initials of the new user
  })

  it('does NOT allow users with same email address to signup', () => {
    // cy.getByData('givenName-input').type('Another')
    cy.get('#givenNames').type('Another')
    // cy.getByData('surname-input').find('input').type('John')
    cy.get('#surname').type('John')
    // cy.getByData('email-input').type('john@example.com')
    cy.get('#email').type('john@example.com')
    // cy.getByData('password-input').type('password')
    cy.get('#password').type('another_password')
    // cy.getByData('confirmPassword-input').type('password')
    cy.get('#confirmPassword').type('another_password')
    // cy.getByData('agreedTc').find("[type='checkbox']").click()
    cy.get('#agreedTc').click()
    cy.get('button[type="submit"]').contains('Sign up').click()
    cy.get('div[role="alert"]').should(
      'have.text',
      'A user with this email already exists',
    )
  })
})

describe('Reset Password', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000')
    cy.get("a[href='/request-password-reset']")
      .contains('Forgot your password?')
      .click()
    cy.location('pathname').should('equal', '/request-password-reset')
  })

  it('existing user asks to reset password successfully', () => {
    cy.get('h1').should('have.text', 'Request password reset')
    cy.get('form').contains(
      'Please enter the email address connected to your account.',
    )
    cy.get('form').find('input').type('john@example.com')
    cy.get('form').find('button').should('have.text', 'Send').click()
    cy.get('div[role="alert"]').should(
      'have.text',
      'Request successful!An email has been sent to john@example.com containing further instructions.Return to the login form',
    )

    cy.get('div[role="alert"]')
      .find('a')
      .should('have.text', 'Return to the login form')
      .click()
    cy.location('pathname').should('equal', '/login')
  })

  // it('existing user resets password and logs in with new password', () => {
  // needs verified user
  // })

  it('does NOT allow invalid email', () => {
    cy.get('form').find('input').type('john')
    cy.get('form').find('button').should('have.text', 'Send').click()
    cy.get('form')
      .find('#email_help')
      .should('have.text', "Doesn't look like a valid email")
  })
})
