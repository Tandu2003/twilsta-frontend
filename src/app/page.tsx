'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { handleLogout } from '@/handlers/auth.handlers';
import { useAppDispatch } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  // Redux dispatch để gọi các thunk
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Sử dụng useAuth hook để kiểm tra authentication
  const { isAuthenticated, isLoading, isInitialized, user } = useAuth();

  // State cho logout loading
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Xử lý nút đăng xuất
  const handleButtonClick = useCallback(async () => {
    if (isLoggingOut) return; // Prevent double click

    setIsLoggingOut(true);
    try {
      // Gọi hàm logout qua handler với router
      await handleLogout(dispatch, router);

      // Không cần xử lý kết quả ở đây vì handler đã xử lý redirect
    } catch (error) {
      console.error('Home: Lỗi logout:', error);
      toast.error('Xảy ra lỗi khi đăng xuất');
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, router, isLoggingOut, isAuthenticated, user]);

  return (
    <div className='flex min-h-screen flex-col lg:flex-row'>
      <div className='bg-background flex flex-1 items-center justify-center p-6 lg:p-12'>
        <div className='w-full max-w-md'>
          <Card className='border-border/50 shadow-lg'>
            <CardHeader>
              <CardTitle className='text-foreground text-2xl font-bold'>
                Thông tin người dùng
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isInitialized || isLoading ? (
                <div className='space-y-2'>
                  <div className='text-muted-foreground'>Đang tải thông tin...</div>
                </div>
              ) : user ? (
                <div className='space-y-2'>
                  <div className='text-primary text-lg font-semibold'>
                    Xin chào, {user.displayName}
                  </div>
                  <div className='text-muted-foreground text-sm'>Email: {user.email}</div>
                </div>
              ) : (
                <div className='space-y-2'>
                  <div className='text-muted-foreground'>Không thể tải thông tin người dùng</div>
                </div>
              )}
            </CardContent>
            <CardFooter className='flex items-center justify-center'>
              <CardAction>
                <Button variant='outline' onClick={handleButtonClick} disabled={isLoggingOut}>
                  {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                </Button>
              </CardAction>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
