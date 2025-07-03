import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const fetchProfileOrders = createAsyncThunk(
  'profile/fetchOrders',
  async () => await getOrdersApi()
);

interface ProfileState {
  orders: TOrder[];
}

const initialState: ProfileState = {
  orders: []
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfileOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
  }
});

export default profileSlice.reducer;
