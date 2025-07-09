/// <reference types="cypress" />

describe('Тесты конструктора бургера (без drag&drop)', () => {
  beforeEach(() => {
    // Очистка перед тестом
    cy.clearCookies();
    cy.clearLocalStorage();

    // Мокаем API
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

    // Заходим на главную страницу
    cy.visit('/');
    cy.wait('@getIngredients');

    // Сохраняем alias
    cy.get('[data-testid="order-button"]').as('orderButton');
    cy.get('[data-testid="constructor-empty-bun-top"]').as('emptyBunTop');
    cy.get('[data-testid="constructor-empty-ingredients"]').as(
      'emptyIngredients'
    );
  });

  afterEach(() => {
    // Очистка после теста
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Добавление ингредиентов в конструктор', () => {
    cy.addIngredient('Краторная булка N-200i');
    cy.get('[data-testid="constructor-bun"]').as('bunSlot');
    cy.get('@bunSlot').should('contain', 'Краторная булка N-200i');

    cy.addIngredient('Биокотлета из марсианской Магнолии');
    cy.get('[data-testid="constructor-ingredient"]').as('ingredientSlot');
    cy.get('@ingredientSlot').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('Работа модальных окон: открытие и закрытие', () => {
    cy.openIngredientModal('Соус Spicy-X');
    cy.get('@ingredientModal')
      .should('be.visible')
      .and('contain', 'Соус Spicy-X');

    cy.closeModalByCross();
    cy.get('@ingredientModal').should('not.exist');

    cy.openIngredientModal('Соус Spicy-X');
    cy.closeModalByOverlay();
    cy.get('@ingredientModal').should('not.exist');
  });

  it('Оформление заказа после авторизации', () => {
    cy.addIngredient('Краторная булка N-200i');
    cy.addIngredient('Биокотлета из марсианской Магнолии');

    cy.get('@orderButton').click();
    cy.get('@orderButton').click();
    cy.wait('@postOrder', { timeout: 10000 });

    cy.get('[data-testid="order-modal"]').as('orderModal');
    cy.get('@orderModal').should('be.visible').and('contain', '12345');

    cy.closeModalByCross();
    cy.get('@orderModal').should('not.exist');

    cy.get('@emptyBunTop').should('contain', 'Выберите булки');
    cy.get('@emptyIngredients').should('contain', 'Выберите начинку');
  });
});
