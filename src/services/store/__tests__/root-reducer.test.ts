import { rootReducer } from '../../store/root-reducer';
import constructorReducer from '../../slices/constructor';
import ingredientsReducer from '../../slices/ingredients';
import orderReducer from '../../slices/order';
import feedReducer from '../../slices/feed';
import profileReducer from '../../slices/profile';
import authReducer from '../../slices/auth';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние для всего стора', () => {
    const expectedInitialState = {
      burgerConstructor: constructorReducer(undefined, { type: '' }),
      ingredients: ingredientsReducer(undefined, { type: '' }),
      order: orderReducer(undefined, { type: '' }),
      feed: feedReducer(undefined, { type: '' }),
      profile: profileReducer(undefined, { type: '' }),
      auth: authReducer(undefined, { type: '' })
    };

    const actualState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(actualState).toEqual(expectedInitialState);
  });
});
