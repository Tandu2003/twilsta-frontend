export interface AuthState {
  user: AuthUser | null;
  accessToken?: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  isActive: boolean;
  isOnline: boolean;
  lastSeenAt?: string;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

// Type cho dữ liệu form đăng nhập
export interface LoginFormData {
  email: string;
  password: string;
}

// Type cho lỗi form đăng nhập
export type LoginFormError = Partial<Record<keyof LoginFormData, string>>;

// Type cho dữ liệu form đăng ký
export interface RegisterFormData {
  username: string;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Type cho lỗi form đăng ký
export type RegisterFormError = Partial<Record<keyof RegisterFormData, string>>;
