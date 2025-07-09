/// <reference types="cypress" />

describe('Тесты конструктора бургера (без drag&drop)', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.window().then((win) => win.localStorage.clear());

    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('POST', '**/api/auth/login', { fixture: 'user.json' }).as(
      'login'
    );
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUserAuthorized'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Добавление ингредиентов в конструктор (клик по "Добавить")', () => {
    cy.get('[data-testid="ingredient-card"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="constructor-bun"]').should(
      'contain',
      'Краторная булка N-200i'
    );

    cy.get('[data-testid="ingredient-card"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="constructor-ingredient"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('Работа модальных окон: открытие и закрытие', () => {
    cy.get('[data-testid="ingredient-card"]').contains('Соус Spicy-X').click();

    cy.get('[data-testid="ingredient-modal"]')
      .should('be.visible')
      .and('contain', 'Соус Spicy-X');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="ingredient-modal"]').should('not.exist');

    cy.get('[data-testid="ingredient-card"]').contains('Соус Spicy-X').click();

    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="ingredient-modal"]').should('not.exist');
  });

  it('Оформление заказа после авторизации', () => {
    cy.get('[data-testid="ingredient-card"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="ingredient-card"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="order-button"]').click();

    cy.get('[data-testid="order-button"]').click();

    cy.wait('@postOrder', { timeout: 10000 });
    cy.get('[data-testid="order-modal"]')
      .should('be.visible')
      .and('contain', '12345');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="order-modal"]').should('not.exist');

    cy.get('[data-testid="constructor-empty-bun-top"]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-testid="constructor-empty-ingredients"]').should(
      'contain',
      'Выберите начинку'
    );
  });
});
