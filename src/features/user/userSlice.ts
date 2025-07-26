// Redux slice for user
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as userService from '@/services/user.service';
import type { ApiResponse } from '@/types/api-response';
import { UserState } from '@/types/user.type';

const initialState: UserState = {
  profile: null,
  status: 'idle',
  error: null,
};

// Async thunk for get profile
export const getProfileThunk = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Gọi API lấy thông tin người dùng
      const result: ApiResponse = await userService.getProfile();
      if (!result.success || !result.data) {
        return rejectWithValue(result.message || 'Lấy thông tin thất bại');
      }
      return result.data;
    } catch (error: any) {
      // Trả về lỗi
      return rejectWithValue(error.response?.data?.message || 'Lấy thông tin thất bại');
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
        state.profile = action.payload;
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
