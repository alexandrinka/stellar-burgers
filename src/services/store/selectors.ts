import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const constructorSelector = (state: RootState) =>
  state.burgerConstructor;
export const orderRequestSelector = (state: RootState) => state.order.request;
export const orderModalSelector = (state: RootState) => state.order.modalData;
export const orderDataSelector = (state: RootState) => state.order.orderData;

export const ingredientsSelector = (state: RootState) =>
  state.ingredients.items;
export const selectedIngredientSelector = (state: RootState) =>
  state.ingredients.selected;
export const ingredientsLoadingSelector = (state: RootState) =>
  state.ingredients.loading;

export const feedOrdersSelector = (state: RootState) => state.feed.orders;
export const feedMetaSelector = (state: RootState) => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday
});

export const profileOrdersSelector = (state: RootState) => state.profile.orders;
export const userDataSelector = (state: RootState) => state.auth.user;
export const isAuthCheckedSelector = (state: RootState) =>
  state.auth.isAuthChecked;
export const registerErrorSelector = (state: RootState) =>
  state.auth.registerError;
export const updateErrorSelector = (state: RootState) => state.auth.updateError;

export const ingredientsByTypeSelector = createSelector(
  [ingredientsSelector],
  (all) => ({
    buns: all.filter((i) => i.type === 'bun'),
    mains: all.filter((i) => i.type === 'main'),
    sauces: all.filter((i) => i.type === 'sauce')
  })
);
