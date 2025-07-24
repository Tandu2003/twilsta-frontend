// Handlers for auth logic (form submit, etc)
import { AppDispatch } from '../store';
import {
  loginThunk,
  registerThunk,
  logoutThunk,
} from '../features/auth/authSlice';

// Đăng nhập
export const handleLogin = async (
  dispatch: AppDispatch,
  data: { username: string; password: string },
) => {
  // Gọi thunk đăng nhập
  await dispatch(loginThunk(data));
};

// Đăng ký
export const handleRegister = async (
  dispatch: AppDispatch,
  data: { username: string; password: string; email: string },
) => {
  // Gọi thunk đăng ký
  await dispatch(registerThunk(data));
};

// Đăng xuất
export const handleLogout = async (dispatch: AppDispatch) => {
  // Gọi thunk đăng xuất
  await dispatch(logoutThunk());
};
