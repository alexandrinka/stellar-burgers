import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const fetchOrder = createAsyncThunk(
  'order/fetch',
  async (ingredientIds: string[]) => await orderBurgerApi(ingredientIds)
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

interface OrderState {
  data: TOrder | null;
  modalData: TOrder | null;
  orderData: TOrder | null;
  request: boolean;
}

const initialState: OrderState = {
  data: null,
  modalData: null,
  orderData: null,
  request: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderModalData(state, action: PayloadAction<TOrder>) {
      state.modalData = action.payload;
    },
    clearOrder(state) {
      state.data = null;
      state.modalData = null;
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.request = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.request = false;
        state.data = action.payload.order;
      })
      .addCase(fetchOrder.rejected, (state) => {
        state.request = false;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderData = action.payload;
      });
  }
});

export const { setOrderModalData, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
