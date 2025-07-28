import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col lg:flex-row'>
      <div className='bg-background flex flex-1 items-center justify-center p-6 lg:p-12'>
        <div className='w-full max-w-md'>{children}</div>
      </div>
    </div>
  );
}
