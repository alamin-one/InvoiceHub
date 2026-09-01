'use client';

import { useRouter } from 'next/navigation';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import handleAlert from '@/lib/handleAlert';
import { useForgotPasswordMutation } from '@/redux/feature/storeSlice';

const ForgotPasswordForm = () => {
  const route = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const res = await forgotPassword({ email }).unwrap();
      if (!res) return;

      handleAlert(
        res.success,
        res.message || 'Verification code sent successfully',
      );
      if (res.success) {
        route.push('/verify?forgotPassword');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(
        false,
        error?.data?.message || error?.error || 'something went wrong',
      );
    }
  };
  return (
    <form onSubmit={onSubmit} className="w-full px-1">
      <div className="space-y-2 w-full">
        <Input
          label="Email"
          id="email"
          type="email"
          name="email"
          placeholder="example@gmail.com"
        />
      </div>

      <Button
        disabled={isLoading}
        loading={isLoading}
        type="submit"
        className="mt-6 w-full bg-yellow text-whiteCustom uppercase"
      >
        {isLoading ? 'loading...' : 'Send Code'}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
