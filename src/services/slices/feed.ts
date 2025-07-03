import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api'; // Убедись, что этот API возвращает { orders, total, totalToday }
import { TOrder } from '@utils-types';

interface FeedState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
}

const initialState: FeedState = {
  orders: [],
  loading: false,
  error: null,
  total: 0,
  totalToday: 0
};

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeed.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.loading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default feedSlice.reducer;
