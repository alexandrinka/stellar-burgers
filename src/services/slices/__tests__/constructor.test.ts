import constructorReducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  setOrderRequest,
  setOrderModalData
} from '../constructor';
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

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  };

  it('обрабатывает setBun', () => {
    const bun = createMockIngredient({ type: 'bun', name: 'Булка' });
    const state = constructorReducer(initialState, setBun(bun));
    expect(state.bun).toEqual(bun);
  });

  it('обрабатывает addIngredient', () => {
    const ingredient = createMockIngredient({ name: 'Начинка' });
    const state = constructorReducer(initialState, addIngredient(ingredient));
    expect(state.ingredients).toContainEqual(ingredient);
  });

  it('обрабатывает removeIngredient', () => {
    const ingredient = createMockIngredient({ id: 'test-id' });
    const stateWithIngredient = {
      ...initialState,
      ingredients: [ingredient]
    };
    const state = constructorReducer(
      stateWithIngredient,
      removeIngredient('test-id')
    );
    expect(state.ingredients).toHaveLength(0);
  });

  it('обрабатывает moveIngredient', () => {
    const ingredient1 = createMockIngredient({ name: 'Начинка 1', id: 'id-1' });
    const ingredient2 = createMockIngredient({ name: 'Начинка 2', id: 'id-2' });
    const stateWithIngredients = {
      ...initialState,
      ingredients: [ingredient1, ingredient2]
    };
    const state = constructorReducer(
      stateWithIngredients,
      moveIngredient({ from: 0, to: 1 })
    );
    expect(state.ingredients[0].name).toBe('Начинка 2');
    expect(state.ingredients[1].name).toBe('Начинка 1');
  });

  it('обрабатывает clearConstructor', () => {
    const filledState = {
      bun: createMockIngredient({ type: 'bun' }),
      ingredients: [createMockIngredient()],
      orderRequest: false,
      orderModalData: { number: 12345 }
    };
    const state = constructorReducer(filledState, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  it('обрабатывает setOrderRequest', () => {
    const state = constructorReducer(initialState, setOrderRequest(true));
    expect(state.orderRequest).toBe(true);
  });

  it('обрабатывает setOrderModalData', () => {
    const modalData = { number: 12345 };
    const state = constructorReducer(
      initialState,
      setOrderModalData(modalData)
    );
    expect(state.orderModalData).toEqual(modalData);
  });
});
