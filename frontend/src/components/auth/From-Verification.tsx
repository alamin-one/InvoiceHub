'use client';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '../ui/input';
import Button from '../ui/button';
import {
  useVerifyForgotPasswordMutation,
  useVerifySignupMutation,
} from '@/redux/feature/storeSlice';
import handleAlert from '@/lib/handleAlert';

const FromVerification = () => {
  const route = useRouter();
  const params = useSearchParams();
  const forgotPassword = params.has('forgotPassword');
  const role = forgotPassword ? 'forgot' : 'signup';

  const [verifySignup, { isLoading }] = useVerifySignupMutation();
  const [verifyForgotPassword, { isLoading: isLoadingForgotPassword }] =
    useVerifyForgotPasswordMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otp = new FormData(e.currentTarget).get('otp');
    if (!otp) return;

    try {
      const res =
        role === 'forgot'
          ? await verifyForgotPassword({ otp }).unwrap()
          : await verifySignup({ otp }).unwrap();

      if (!res) return;
      if (res.success) {
        if (role === 'forgot') {
          route.push('/reset-password');
        } else {
          Cookies.set('clientToken', res.clientToken, {
            expires: 20,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          });

          handleAlert(res?.success, res.message || 'Login successful');
          route.push('/dashboard');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(
        false,
        error?.data?.message || error?.error || 'something went wrong!',
      );
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-3 px-1">
      <Input name="otp" type="number" />

      <Button
        className="w-full"
        type="submit"
        disabled={isLoading || isLoadingForgotPassword}
        loading={isLoading || isLoadingForgotPassword}
      >
        Verify Code
      </Button>
    </form>
  );
};

export default FromVerification;
