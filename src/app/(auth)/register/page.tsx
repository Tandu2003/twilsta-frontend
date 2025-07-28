'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import RegisterForm from '@/components/auth/RegisterForm';
import { handleRegisterSubmit } from '@/handlers/auth.handlers';
import { useAppDispatch } from '@/hooks/redux';
import { RegisterFormData, RegisterFormError } from '@/types/auth.type';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegisterFormError>({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  // Handle input change
  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Handle form submit
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await handleRegisterSubmit(dispatch, formData, () => {
        // Redirect về trang verify email hoặc login
        router.push('/verify-email');
      });

      if (!result.success && result.errors) {
        setErrors(result.errors);
      }
    } catch (error: any) {
      toast.error(error || 'Xảy ra lỗi khi đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google register
  const handleGoogleRegister = () => {
    toast.info('Chức năng đăng ký với Google đang được phát triển');
  };

  return (
    <RegisterForm
      formData={formData}
      errors={errors}
      isLoading={isLoading}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onGoogleRegister={handleGoogleRegister}
    />
  );
}
