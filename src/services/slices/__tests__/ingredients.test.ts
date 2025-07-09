import ingredientsReducer, {
  fetchIngredients,
  selectIngredient
} from '../ingredients';
import { TConstructorIngredient } from '../../../utils/types';

const createMockIngredient = (
  overrides: Partial<TConstructorIngredient> = {}
): TConstructorIngredient => ({
  _id: 'mock-id',
  name: 'Тестовый ингредиент',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 500,
  image: 'https://fake.image/ingredient.png',
  image_mobile: 'https://fake.image/ingredient-mobile.png',
  image_large: 'https://fake.image/ingredient-large.png',
  id: 'unique-id',
  ...overrides
});

describe('ingredientsSlice', () => {
  const initialState = {
    items: [],
    selected: null,
    loading: false
  };

  it('устанавливает loading=true при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('записывает данные при fetchIngredients.fulfilled', () => {
    const ingredients = [
      createMockIngredient({ name: 'Булка' }),
      createMockIngredient({ name: 'Соус' })
    ];
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: ingredients
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.items).toEqual(ingredients);
    expect(state.loading).toBe(false);
  });

  it('устанавливает loading=false при fetchIngredients.rejected', () => {
    const action = { type: fetchIngredients.rejected.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
  });

  it('обрабатывает selectIngredient', () => {
    const ingredient = createMockIngredient({ name: 'Соус Spicy-X' });
    const state = ingredientsReducer(
      initialState,
      selectIngredient(ingredient)
    );
    expect(state.selected).toEqual(ingredient);
  });
});
