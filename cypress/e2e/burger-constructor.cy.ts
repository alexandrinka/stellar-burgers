/// <reference types="cypress" />

describe('Тесты конструктора бургера (без drag&drop)', () => {
  beforeEach(() => {
    // Чистим токены, чтобы быть неавторизованными
    cy.clearCookies();
    cy.window().then((win) => win.localStorage.clear());

    // Мокаем API
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    // cy.intercept('GET', '**/api/auth/user', {
    //   statusCode: 401,
    //   body: { success: false, message: 'Unauthorized' }
    // }).as('getUserUnauthorized');
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
  });

  it('Добавление ингредиентов в конструктор (клик по "Добавить")', () => {
    // Добавляем булку
    cy.get('[data-testid="ingredient-card"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    // Проверка, что булка добавлена
    cy.get('[data-testid="constructor-bun"]').should(
      'contain',
      'Краторная булка N-200i'
    );

    // Добавляем начинку
    cy.get('[data-testid="ingredient-card"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    // Проверка, что начинка добавлена
    cy.get('[data-testid="constructor-ingredient"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('Работа модальных окон: открытие и закрытие', () => {
    // Открываем модалку ингредиента
    cy.get('[data-testid="ingredient-card"]').contains('Соус Spicy-X').click();

    // Проверка открытия
    cy.get('[data-testid="ingredient-modal"]')
      .should('be.visible')
      .and('contain', 'Соус Spicy-X');

    // Закрываем по крестику
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="ingredient-modal"]').should('not.exist');

    // Открываем снова
    cy.get('[data-testid="ingredient-card"]').contains('Соус Spicy-X').click();

    // Закрываем по оверлею
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="ingredient-modal"]').should('not.exist');
  });

  it('Оформление заказа после авторизации', () => {
    // Добавляем булку
    cy.get('[data-testid="ingredient-card"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    // Добавляем начинку
    cy.get('[data-testid="ingredient-card"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    // Кликаем "Оформить заказ" → ожидаем редирект на /login
    cy.get('[data-testid="order-button"]').click();
    // cy.url().should('include', '/login');

    // // Авторизуемся
    // cy.get('input[name="email"]').type('test@example.com');
    // cy.get('input[name="password"]').type('123456');
    // cy.get('button[type="submit"]').click();

    // // Проверка успешного логина
    // cy.wait('@login');
    // cy.wait('@getUserAuthorized');
    // cy.url().should('eq', 'http://localhost:4000/');

    // Кликаем "Оформить заказ" снова
    cy.get('[data-testid="order-button"]').click();

    // Проверка модалки заказа
    cy.wait('@postOrder', { timeout: 10000 });
    cy.get('[data-testid="order-modal"]')
      .should('be.visible')
      .and('contain', '12345');

    // Закрываем модалку
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="order-modal"]').should('not.exist');

    // Проверка очистки конструктора
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
