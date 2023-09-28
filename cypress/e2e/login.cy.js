/* eslint-disable jest/expect-expect */
describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000')
  })

  it('allows user to login with admin credentials', () => {
    cy.getByData('email-input').type('admin@example.com')
    cy.getByData('password-input').type('password')
    cy.get("button[type='submit']").contains('Log in').click()
    cy.location('pathname').should('equal', '/dashboard')
    cy.getByData('avatar-initials').should('exist').contains('AA')
    cy.getByData('avatar-initials').click()
    cy.get('li[role="menuitem"]').contains('Logout').click()
    cy.location('pathname').should('equal', '/login')
  })

  it('does NOT allow user to login without typing credentials', () => {
    cy.get("button[type='submit']").contains('Log in').click()
    cy.location('pathname').should('equal', '/login')
    cy.get('#email_help').contains('Email is required')
    cy.get('#password_help').contains('Password is required')
  })

  it('does NOT allow user to login with wrong credentials', () => {
    cy.getByData('email-input').type('admin@example.com')
    cy.getByData('password-input').type('123')
    cy.get("button[type='submit']").contains('Log in').click()
    cy.location('pathname').should('equal', '/login')
    cy.contains('Invalid credentials')
  })

  it('does NOT allow user to login with invalid address', () => {
    cy.getByData('email-input').type('admin')
    cy.getByData('password-input').type('password')
    cy.get("button[type='submit']").contains('Log in').click()
    cy.location('pathname').should('equal', '/login')
    cy.get('#email_help').contains('This is not a valid email address')
  })
})

describe('Signup', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000')
    cy.get("a[href='/signup']")
      .contains('Do you want to signup instead?')
      .click()
    cy.location('pathname').should('equal', '/signup')
  })

  it('new user signs up', () => {
    cy.getByData('givenName-input').type('John')
    cy.getByData('surname-input').find('input').type('Smith')
    cy.getByData('email-input').type('john@example.com')
    cy.getByData('password-input').type('password')
    cy.getByData('confirmPassword-input').type('password')
    cy.getByData('agreedTc').find("[type='checkbox']").click()
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
    cy.getByData('givenName-input').type('John')
    cy.getByData('surname-input').find('input').type('Smith')
    cy.getByData('email-input').type('john@example.com')
    cy.getByData('password-input').type('password')
    cy.getByData('confirmPassword-input').type('password')
    cy.getByData('agreedTc').find("[type='checkbox']").click()
    cy.get('button[type="submit"]').contains('Sign up').click()
    cy.get('div[role="alert"]').should(
      'have.text',
      'A user with this email already exists',
    )
  })

  it('does NOT allow user to signup without filling all the fields', () => {
    cy.get('button[type="submit"]').contains('Sign up').click()
    cy.getByData('givenName-input').contains('Given name is required')
    cy.getByData('surname-input').contains('Surname is required')
    cy.getByData('email-input').contains('Email is required')
    cy.getByData('password-input').contains('Password is required')
    cy.getByData('password-input').contains(
      'Password should not be shorter than 8 characters',
    )
    cy.getByData('confirmPassword-input').contains(
      'Please confirm your password!',
    )
    cy.getByData('agreedTc').contains(
      'You need to agree to the terms and conditions',
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

  it('new user signs up', () => {
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

  it('does NOT allow invalid email', () => {
    cy.get('form').find('input').type('john')
    cy.get('form').find('button').should('have.text', 'Send').click()
    cy.get('form')
      .find('#email_help')
      .should('have.text', "Doesn't look like a valid email")
  })
})
