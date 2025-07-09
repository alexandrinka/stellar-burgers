/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Добавляет ингредиент по имени
     * @param name Имя ингредиента
     */
    addIngredient(name: string): Chainable<void>;

    /**
     * Открывает модалку ингредиента по имени
     * @param name Имя ингредиента
     */
    openIngredientModal(name: string): Chainable<void>;

    /**
     * Закрывает модалку по крестику
     */
    closeModalByCross(): Chainable<void>;

    /**
     * Закрывает модалку по оверлею
     */
    closeModalByOverlay(): Chainable<void>;
  }
}
