// Redux slice for user
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { logoutThunk } from '@/features/auth/authSlice';
import * as userService from '@/services/user.service';
import type { ApiResponse, AxiosErrorResponse } from '@/types/api-response';
import { UserProfile, UserState } from '@/types/user.type';

const initialState: UserState = {
  profile: null,
  status: 'idle',
  error: null,
};

// Async thunk for get profile
export const getProfileThunk = createAsyncThunk(
  'user/getProfile',
  async (callApi: (config: AxiosRequestConfig) => Promise<AxiosResponse>, { rejectWithValue }) => {
    try {
      // Gọi API lấy thông tin người dùng với callApi để tự động refresh token
      const result: ApiResponse = await userService.getProfile(callApi);
      if (!result.success || !result.data) {
        return rejectWithValue(result.message || 'Lấy thông tin thất bại');
      }
      return result.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      // Trả về lỗi
      return rejectWithValue(axiosError.response?.data?.message || 'Lấy thông tin thất bại');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Get profile
      .addCase(getProfileThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload as UserProfile;
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Clear profile when logout
      .addCase(logoutThunk.fulfilled, state => {
        state.profile = null;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logoutThunk.rejected, state => {
        state.profile = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
