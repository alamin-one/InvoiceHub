'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Eye, EyeOff } from 'lucide-react';
import Input from '../ui/input';
import Button from '../ui/button';
import handleAlert from '@/lib/handleAlert';
import { useResetPasswordMutation } from '@/redux/feature/storeSlice';

const FormResetPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const route = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    password: string;
    confirmPassword: string;
  }>();
  const [showNewP, setShowNewP] = useState(false);
  const [showCnfNew, setShowCnfNew] = useState(false);

  const onSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }): Promise<void> => {
    try {
      const res = await resetPassword(data).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message || '');
      if (res.success) {
        route.push('/signin');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(false, error?.data?.message || error?.error || 'something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="border-t border-border pt-4 space-y-3 w-full">
        <div className="relative w-full  ">
          <Input
            type={showNewP ? 'text' : 'password'}
            label="New Password"
            {...register('password', {
              required: 'New Password is required',
            })}
            placeholder="••••••••"
            error={errors.password}
          />{' '}
          <button
            type="button"
            onClick={() => setShowNewP(prev => !prev)}
            className={`absolute right-3  top-1/2  ${errors.password ? '-translate-y-1/2' : 'translate-y-1/2 '} text-gray-400 transition-colors`}
          >
            {showNewP ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="relative w-full">
          <Input
            type={showCnfNew ? 'text' : 'password'}
            label="Confirm New Password"
            {...register('confirmPassword', {
              required: 'Confirm New Password is required',
            })}
            placeholder="••••••••"
            error={errors.confirmPassword}
          />{' '}
          <button
            type="button"
            onClick={() => setShowCnfNew(prev => !prev)}
            className={`absolute right-3  top-1/2  ${errors.confirmPassword ? '-translate-y-1/2' : 'translate-y-1/2 '} text-gray-400 transition-colors`}
          >
            {showCnfNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          className="w-full mt-5"
        >
          Reset Password
        </Button>
      </div>
    </form>
  );
};

export default FormResetPassword;
