import { getProfileThunk } from '@/features/user/userSlice';

import { AppDispatch } from '../store';

// Lấy thông tin người dùng
export const handleGetProfile = async (dispatch: AppDispatch) => {
  // Gọi thunk lấy thông tin người dùng
  await dispatch(getProfileThunk());
};
