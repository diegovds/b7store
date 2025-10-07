describe('Homepage', () => {
  it('check page loading', () => {
    cy.visit('/')
    cy.get('.mt-4 > .bg-blue-600')
  })

  it('check the most viewed products section', () => {
    cy.visit('/')
    cy.get(':nth-child(3) > .flex-col > .text-\\[18px\\]').contains(
      'Produtos mais vistos',
    )
  })

  it('check the best-selling products section', () => {
    cy.visit('/')
    cy.get('.pb-10 > .flex-col > .text-\\[18px\\]').contains(
      'Produtos mais vendidos',
    )
  })
})

describe('Auth', () => {
  it('sign in success', () => {
    cy.visit('/login')
    cy.get('.my-4 > .gap-4 > :nth-child(1) > [name="email"]').type(
      'test@email.com',
    )
    cy.get('[name="password"]').type('123456')
    cy.contains('Entrar').click()
    cy.get('.mt-4 > .bg-blue-600')
  })

  it('sign in error', () => {
    cy.visit('/login')
    cy.get('.my-4 > .gap-4 > :nth-child(1) > [name="email"]').type(
      'test@email.com',
    )
    cy.get('[name="password"]').type('1234567')
    cy.contains('Entrar').click()
    cy.get('.my-4 > .mb-6').contains('Insira seus dados e faça login')
  })

  // Ignora erro de redirect do Next.js
  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('NEXT_REDIRECT')) return false
  })

  it('sign out', () => {
    cy.visit('/login')
    cy.get('.my-4 > .gap-4 > :nth-child(1) > [name="email"]').type(
      'test@email.com',
    )
    cy.get('[name="password"]').type('123456')
    cy.contains('Entrar').click()
    cy.location('pathname', { timeout: 10000 }).should('eq', '/')
    cy.get('[href="/my-orders"] > .flex').click()
    cy.location('pathname', { timeout: 10000 }).should('eq', '/my-orders')
    cy.get(
      '.py-12 > :nth-child(1) > .flex-col > .items-center > .text-2xl',
    ).contains('Minha conta')
    cy.get('[data-testid="signout-button"]').click()
    cy.location('pathname', { timeout: 10000 }).should('eq', '/')
  })
})
