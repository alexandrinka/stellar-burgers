import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  registerUserApi,
  updateUserApi,
  TRegisterData,
  logoutApi
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

// ===== THUNKS =====

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: TRegisterData, thunkAPI) => {
    try {
      const response = await registerUserApi(userData);
      return response.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<TRegisterData>, thunkAPI) => {
    try {
      const response = await updateUserApi(userData);
      return response.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; Max-Age=0';
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ===== STATE =====

interface AuthState {
  user: TUser | null;
  isAuthChecked: boolean;
  registerError: string;
  updateError: string;
}

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  registerError: '',
  updateError: ''
};

// ===== SLICE =====

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearRegisterError(state) {
      state.registerError = '';
    },
    clearUpdateError(state) {
      state.updateError = '';
    }
  },
  extraReducers: (builder) => {
    builder

      // === fetchUser ===
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      // === registerUser ===
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.registerError = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthChecked = true;
        state.registerError = action.payload as string;
      })

      // === updateUser ===
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.updateError = '';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateError = action.payload as string;
      })

      // === logoutUser ===
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  }
});

export const { clearRegisterError, clearUpdateError } = authSlice.actions;
export default authSlice.reducer;
