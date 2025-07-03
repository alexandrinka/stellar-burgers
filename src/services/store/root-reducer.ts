import { combineReducers } from '@reduxjs/toolkit';
import constructorReducer from '../slices/constructor';
import ingredientsReducer from '../slices/ingredients';
import orderReducer from '../slices/order';
import feedReducer from '../slices/feed';
import profileReducer from '../slices/profile';
import authReducer from '../slices/auth';

export const rootReducer = combineReducers({
  burgerConstructor: constructorReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  feed: feedReducer,
  profile: profileReducer,
  auth: authReducer
});
