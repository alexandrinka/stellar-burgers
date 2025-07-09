/// <reference types="cypress" />
import './index';

// Добавить ингредиент по имени
Cypress.Commands.add('addIngredient', (name: string) => {
  cy.get('[data-testid="ingredient-card"]')
    .contains(name)
    .parent()
    .find('button')
    .click();
});

// Открыть модалку ингредиента по имени
Cypress.Commands.add('openIngredientModal', (name: string) => {
  cy.get('[data-testid="ingredient-card"]').contains(name).click();
  cy.get('[data-testid="ingredient-modal"]').as('ingredientModal');
});

// Закрыть модалку по крестику
Cypress.Commands.add('closeModalByCross', () => {
  cy.get('[data-testid="modal-close"]').click();
});

// Закрыть модалку по оверлею
Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('[data-testid="modal-overlay"]').click({ force: true });
});
