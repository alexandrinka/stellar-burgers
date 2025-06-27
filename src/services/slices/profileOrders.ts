import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

interface ProfileOrdersState {
  orders: TOrder[];
}

const initialState: ProfileOrdersState = {
  orders: []
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<TOrder[]>) {
      state.orders = action.payload;
    }
  }
});

export const { setOrders } = profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;
