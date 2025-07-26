// Redux slice for authentication
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as authService from '@/services/auth.service';
import type { ApiResponse } from '@/types/api-response';
import { AuthState, LoginDto, RegisterDto } from '@/types/auth.type';

const initialState: AuthState = {
  user: null,
  accessToken: undefined,
  status: 'idle',
  error: null,
};

// Async thunk for login
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: LoginDto, { rejectWithValue }) => {
    try {
      // Gọi API đăng nhập
      const result: ApiResponse = await authService.login(data);
      if (!result.success || !result.data) {
        return rejectWithValue(result.message || 'Đăng nhập thất bại');
      }
      return result.data;
    } catch (error: any) {
      // Trả về lỗi
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

// Async thunk for register
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: RegisterDto, { rejectWithValue }) => {
    try {
      // Gọi API đăng ký
      const result: ApiResponse = await authService.register(data);
      if (!result.success || !result.data) {
        return rejectWithValue(result.message || 'Đăng ký thất bại');
      }
      return result.data;
    } catch (error: any) {
      // Trả về lỗi
      return rejectWithValue(error.response?.data?.message || 'Xảy ra lỗi khi đăng ký');
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    // Gọi API đăng xuất
    const result: ApiResponse = await authService.logout();
    if (!result.success) {
      return rejectWithValue(result.message || 'Đăng xuất thất bại');
    }
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Đăng xuất thất bại');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Có thể thêm các reducer sync nếu cần
    resetError(state) {
      state.error = null;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.status = 'idle';
        state.user = null;
        state.accessToken = undefined;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
