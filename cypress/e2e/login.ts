// https://on.cypress.io/api

describe('Test Login Form', () => {
  beforeEach(() => {
    cy.visit('/login') // Change this to your actual login page URL
  })

  it('should have "Login" as the value of the h2 tag', () => {
    cy.get('h2').should('have.text', 'Login')
  })

  it('should be able to type in the email input', () => {
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="email"]')
      .type('test@example.com')
      .should('have.value', 'test@example.com')
  })

  it('should be able to type in the password input', () => {
    cy.get('input[type="password"]')
      .should('be.visible')
      .type('password123')
      .should('have.value', 'password123')
  })
})
