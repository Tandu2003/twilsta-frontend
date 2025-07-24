// Handlers for user logic (form submit, etc)
import { AppDispatch } from '../store';
import { getProfileThunk } from '@/features/user/userSlice';

// Lấy thông tin người dùng
export const handleGetProfile = async (dispatch: AppDispatch) => {
  // Gọi thunk lấy thông tin
  await dispatch(getProfileThunk());
};

// ...existing code...
