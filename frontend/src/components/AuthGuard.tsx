// components/AuthGuard.tsx
'use client';

import { useCheckAuthQuery } from '@/redux/feature/storeSlice';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Loading from './shared/Loading';

const authPages = [
  '/signup',
  '/signin',
  '/forgot-password',
  '/reset-password',
  '/verify',
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { isLoading, isError, isSuccess } = useCheckAuthQuery();

  const isAuthPage = authPages.some(item => pathname.startsWith(item));

  useEffect(() => {
    if (isLoading) return;

    if (isSuccess && isAuthPage) {
      router.push('/dashboard');
      return;
    }

    if (isError && !isAuthPage) {
      router.push('/signin');
      return;
    }
  }, [isLoading, isSuccess, isError, isAuthPage, router]);

  if (isLoading) return <Loading className="h-screen" />;
  if (isSuccess && isAuthPage) return null;
  if (isError && !isAuthPage) return null;

  return <>{children}</>;
}
