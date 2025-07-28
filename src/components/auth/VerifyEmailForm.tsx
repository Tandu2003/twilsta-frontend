'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { verifyEmail } from '@/services/auth.service';

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verify email khi có token
  useEffect(() => {
    if (token) {
      setIsLoading(true);
      verifyEmail(token)
        .then(result => {
          if (result.success) {
            setIsVerified(true);
            toast.success('Email đã được xác minh thành công!');
          } else {
            setError(result.message || 'Xác minh email thất bại');
            toast.error(result.message || 'Xác minh email thất bại');
          }
        })
        .catch(error => {
          setError('Có lỗi xảy ra khi xác minh email');
          toast.error('Có lỗi xảy ra khi xác minh email');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token]);

  // Hiển thị loading
  if (isLoading) {
    return (
      <Card className='border-border/50 shadow-lg'>
        <CardHeader className='text-center'>
          <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent'></div>
          </div>
          <CardTitle className='text-foreground text-2xl font-bold'>
            Đang Xác Minh Email...
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            Vui lòng chờ trong giây lát
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Hiển thị kết quả
  const hasValidToken = token && (isVerified || !error);

  return (
    <Card className='border-border/50 shadow-lg'>
      <CardHeader className='text-center'>
        <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
          {hasValidToken ? (
            <CheckCircle className='text-primary h-8 w-8' />
          ) : (
            <XCircle className='h-8 w-8 text-red-500' />
          )}
        </div>
        <CardTitle className='text-foreground text-2xl font-bold'>
          {hasValidToken ? 'Xác Minh Email Thành Công!' : 'Xác Minh Email Thất Bại!'}
        </CardTitle>
        <CardDescription className='text-muted-foreground'>
          {hasValidToken
            ? 'Email của bạn đã được xác minh. Bạn có thể truy cập tất cả tính năng của Twilsta.'
            : error || 'Có vẻ như mã xác minh không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.'}
        </CardDescription>
      </CardHeader>

      {hasValidToken && (
        <CardContent className='space-y-6'>
          <Alert className='border-primary/20 bg-primary/10'>
            <CheckCircle className='h-4 w-4' />
            <AlertDescription>
              Chào mừng đến với Twilsta! Tài khoản của bạn đã được kích hoạt hoàn toàn và sẵn sàng
              sử dụng.
            </AlertDescription>
          </Alert>

          <div className='space-y-4 text-center'>
            <div className='bg-secondary/50 border-border/50 rounded-lg border p-4'>
              <h3 className='text-foreground mb-2 font-medium'>Bước tiếp theo?</h3>
              <ul className='text-muted-foreground space-y-1 text-sm'>
                <li>• Hoàn thành thiết lập hồ sơ</li>
                <li>• Bắt đầu kết nối với bạn bè</li>
                <li>• Chia sẻ bài đăng đầu tiên</li>
                <li>• Khám phá cộng đồng</li>
              </ul>
            </div>
          </div>
        </CardContent>
      )}

      {hasValidToken && (
        <CardFooter className='flex-col space-y-4'>
          <Separator className='bg-border' />
          <Link
            href='/login'
            className='text-primary hover:text-primary/80 text-sm transition-colors'
          >
            Đi Đến Đăng Nhập
          </Link>
        </CardFooter>
      )}

      {!hasValidToken && (
        <CardFooter className='flex-col space-y-4'>
          <Separator className='bg-border' />
          <div className='space-y-2 text-center'>
            <Link
              href='/login'
              className='text-primary hover:text-primary/80 block text-sm transition-colors'
            >
              Đi Đến Đăng Nhập
            </Link>
            <Link
              href='/resend-verification'
              className='text-primary hover:text-primary/80 block text-sm transition-colors'
            >
              Gửi Lại Email Xác Minh
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
