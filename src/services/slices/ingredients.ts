import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => await getIngredientsApi()
);

interface IngredientsState {
  items: TIngredient[];
  selected: TIngredient | null;
  loading: boolean;
}

const initialState: IngredientsState = {
  items: [],
  selected: null,
  loading: false
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    selectIngredient(state, action) {
      state.selected = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { selectIngredient } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
