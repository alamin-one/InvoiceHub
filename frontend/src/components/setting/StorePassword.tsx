'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Input from '../ui/input';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../ui/button';
import handleAlert from '@/lib/handleAlert';
import { useUpdatePasswordMutation } from '@/redux/feature/storeSlice';

const StorePassword = () => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }>();

  const [showNewP, setShowNewP] = useState(false);
  const [showCnfNew, setShowCnfNew] = useState(false);

  const onSubmit = async (data: {
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> => {
    try {
      const res = await updatePassword(data).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message || '');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(
        false,
        error?.data?.message || error?.error || 'something went wrong!',
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className=" ">Password</h4>
      <p className="p13">
        Set the password and formatting used across invoices.
      </p>

      <div className="border-t border-border mt-5 pt-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-5 "></div>

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
          className="w-fit"
        >
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default StorePassword;
