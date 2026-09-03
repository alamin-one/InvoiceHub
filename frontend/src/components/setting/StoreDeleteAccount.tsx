'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

import Input from '../ui/input';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import Button from '../ui/button';
import handleAlert from '@/lib/handleAlert';
import { useDeleteAccountMutation } from '@/redux/feature/storeSlice';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const StoreDeleteAccount = () => {
  const route = useRouter();
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    password: string;
  }>();

  const [showNewP, setShowNewP] = useState(false);

  const onSubmit = async (data: { password: string }): Promise<void> => {
    try {
      const res = await deleteAccount(data).unwrap();
      if (!res) return;
      if (res.success) {
        handleAlert(res.success, res.message || 'Store Delete Successfully');
        Cookies.remove('clientToken', {
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        route.push('/signup');
        route.refresh();
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className=" "> Delete Account</h4>
      <p className="p13">Enter the password to delete your account.</p>

      <div className="border-t border-border mt-5 pt-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-5 "></div>

        <div className="relative w-full  ">
          <Input
            type={showNewP ? 'text' : 'password'}
            label="Password"
            {...register('password', {
              required: 'Password is required',
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

        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          variant="secondary"
          className="w-fit text-danger! hover:border-danger! "
        >
          Delete Account <Trash2 size={16} />
        </Button>
      </div>
    </form>
  );
};

export default StoreDeleteAccount;
