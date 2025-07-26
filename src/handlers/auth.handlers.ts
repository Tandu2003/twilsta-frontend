import { LoginDto, RegisterDto } from '@/types/auth.type';

import { loginThunk, logoutThunk, registerThunk } from '../features/auth/authSlice';
import { AppDispatch } from '../store';

// Đăng nhập
export const handleLogin = async (dispatch: AppDispatch, data: LoginDto) => {
  // Gọi thunk đăng nhập
  const result = await dispatch(loginThunk(data));
  return result;
};

// Đăng ký
export const handleRegister = async (dispatch: AppDispatch, data: RegisterDto) => {
  // Gọi thunk đăng ký
  const result = await dispatch(registerThunk(data));
  return result;
};

// Đăng xuất
export const handleLogout = async (dispatch: AppDispatch) => {
  // Gọi thunk đăng xuất
  const result = await dispatch(logoutThunk());
  return result;
};
