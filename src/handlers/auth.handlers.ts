import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { toast } from 'sonner';

import {
  LoginDto,
  LoginFormData,
  LoginFormError,
  RegisterDto,
  RegisterFormData,
  RegisterFormError,
} from '@/types/auth.type';

import { loginThunk, logoutThunk, registerThunk } from '../features/auth/authSlice';
import { AppDispatch } from '../store';

// Validate form đăng nhập
export const validateLoginForm = (formData: LoginFormData): LoginFormError => {
  const errors: LoginFormError = {};

  if (!formData.email.trim()) {
    errors.email = 'Email là bắt buộc';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!formData.password.trim()) {
    errors.password = 'Mật khẩu là bắt buộc';
  }

  return errors;
};

// Validate form đăng ký
export const validateRegisterForm = (formData: RegisterFormData): RegisterFormError => {
  const errors: RegisterFormError = {};

  if (!formData.username.trim()) {
    errors.username = 'Tên đăng nhập là bắt buộc';
  } else if (formData.username.length < 3) {
    errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
  }

  if (!formData.displayName.trim()) {
    errors.displayName = 'Tên hiển thị là bắt buộc';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email là bắt buộc';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!formData.password.trim()) {
    errors.password = 'Mật khẩu là bắt buộc';
  } else if (formData.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  if (!formData.confirmPassword.trim()) {
    errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu không khớp';
  }

  return errors;
};

// Đăng nhập với validate và toast
export const handleLoginSubmit = async (
  dispatch: AppDispatch,
  formData: LoginFormData,
  onSuccess?: () => void
) => {
  // Validate form
  const errors = validateLoginForm(formData);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // Gọi thunk đăng nhập
  const result = await dispatch(loginThunk(formData));

  if (result.type.includes('rejected')) {
    toast.error((result.payload as string) || 'Đăng nhập thất bại');
    return { success: false, errors: {} as LoginFormError };
  } else if (result.type.includes('fulfilled')) {
    const payload = result.payload as { message?: string };
    toast.success(payload.message || 'Đăng nhập thành công');
    onSuccess?.();
    return { success: true, errors: {} as LoginFormError };
  }

  return { success: false, errors: {} as LoginFormError };
};

// Đăng ký với validate và toast
export const handleRegisterSubmit = async (
  dispatch: AppDispatch,
  formData: RegisterFormData,
  onSuccess?: () => void
) => {
  // Validate form
  const errors = validateRegisterForm(formData);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // Chuyển đổi formData thành RegisterDto (bỏ confirmPassword)
  const registerData: RegisterDto = {
    email: formData.email,
    password: formData.password,
    username: formData.username,
    displayName: formData.displayName,
  };

  // Gọi thunk đăng ký
  const result = await dispatch(registerThunk(registerData));

  if (result.type.includes('rejected')) {
    toast.error((result.payload as string) || 'Đăng ký thất bại vui lòng thử lại');
    return { success: false, errors: {} as RegisterFormError };
  } else if (result.type.includes('fulfilled')) {
    const payload = result.payload as { message?: string };
    toast.success(
      payload.message || 'Đăng ký thành công, vui lòng kiểm tra email để xác minh tài khoản'
    );
    onSuccess?.();
    return { success: true, errors: {} as RegisterFormError };
  }

  return { success: false, errors: {} as RegisterFormError };
};

// Đăng nhập (giữ nguyên cho backward compatibility)
export const handleLogin = async (dispatch: AppDispatch, data: LoginDto) => {
  // Gọi thunk đăng nhập
  const result = await dispatch(loginThunk(data));
  return result;
};

// Đăng ký (giữ nguyên cho backward compatibility)
export const handleRegister = async (dispatch: AppDispatch, data: RegisterDto) => {
  // Gọi thunk đăng ký
  const result = await dispatch(registerThunk(data));
  return result;
};

// Đăng xuất với Next.js router
export const handleLogout = async (dispatch: AppDispatch, router?: AppRouterInstance) => {
  try {
    // Gọi thunk đăng xuất
    const result = await dispatch(logoutThunk());

    // Luôn clear state và redirect, kể cả khi API thất bại
    // vì mục đích chính là đăng xuất user khỏi frontend
    if (result.type.includes('fulfilled')) {
      toast.success('Đăng xuất thành công');
    } else if (result.type.includes('rejected')) {
      toast.warning('Đăng xuất khỏi ứng dụng (API thất bại)');
    }

    // Luôn redirect sau khi clear state
    if (router) {
      // Sử dụng Next.js router nếu có
      router.push('/login');
    } else {
      // Fallback về window.location nếu không có router
      window.location.href = '/login';
    }

    return result;
  } catch (error) {
    // Nếu có lỗi nghiêm trọng, vẫn force logout
    dispatch({ type: 'auth/logoutThunk/fulfilled', payload: null });

    if (router) {
      router.push('/login');
    } else {
      window.location.href = '/login';
    }

    throw error;
  }
};

// Force logout (không gọi API, chỉ clear state)
export const handleForceLogout = (dispatch: AppDispatch) => {
  // Clear state mà không gọi API
  dispatch({ type: 'auth/logoutThunk/fulfilled', payload: null });
};

// Force logout với API call
export const handleForceLogoutWithApi = async (dispatch: AppDispatch) => {
  try {
    // Gọi API force logout để clear cookie
    await import('@/services/auth.service').then(({ forceLogout }) => forceLogout());
  } catch (error) {
    // Bỏ qua lỗi API, vẫn clear state
  } finally {
    // Luôn clear state
    dispatch({ type: 'auth/logoutThunk/fulfilled', payload: null });
  }
};
