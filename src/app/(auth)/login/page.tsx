'use client';

import { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import LoginForm from '@/components/auth/LoginForm';
import { handleLoginSubmit } from '@/handlers/auth.handlers';
import { handleGetProfile } from '@/handlers/user.handlers';
import { useAppDispatch } from '@/hooks/redux';
import { useApiWithRefresh } from '@/hooks/useApiWithRefresh';
import { LoginFormData, LoginFormError } from '@/types/auth.type';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormError>({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const callApi = useApiWithRefresh();

  // Handle input change
  const handleInputChange = useCallback((field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  // Handle form submit
  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await handleLoginSubmit(dispatch, formData, async () => {
        // Lấy thông tin user hiện tại
        try {
          await handleGetProfile(dispatch, callApi);
        } catch (profileError) {
          console.error('Lỗi khi lấy thông tin user:', profileError);
        }
        // Redirect về trang home
        router.push('/');
      });

      if (!result.success && result.errors) {
        setErrors(result.errors);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Xảy ra lỗi khi đăng nhập';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, formData, router, callApi]);

  // Handle Google login
  const handleGoogleLogin = useCallback(() => {
    toast.info('Chức năng đăng nhập với Google đang được phát triển');
  }, []);

  return (
    <LoginForm
      formData={formData}
      errors={errors}
      isLoading={isLoading}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
    />
  );
}
