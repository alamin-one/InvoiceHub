'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { SignUpFormData } from '@/types/signup';
import handleAlert from '@/lib/handleAlert';
import { useSignInMutation } from '@/redux/feature/storeSlice';

const FormSignIn = () => {
  const [show, setShow] = useState(false);
  const route = useRouter();
  const [signIn, { isLoading }] = useSignInMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const res = await signIn(data).unwrap();
      if (!res) return;
      handleAlert(res?.success, res.message || 'Login successful');
      if (res.success) {
        route.push('/dashboard');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(false, error?.data?.message || error?.message || 'Something went wrong!!');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full px-1">
      <Input
        type="email"
        label="E-mail"
        placeholder=" example@gmail.com"
        {...register('email', {
          required: 'Email is required',
        })}
        error={errors.email}
      />

      <div className="relative w-full  ">
        <div className="flex items-center justify-between mb-1.5">
          <label className="p13">Password</label>
          <Link
            href="/forgot-password"
            type="button"
            className="p13 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          {...register('password', {
            required: 'Password is required',
          })}
          error={errors.password}
        />
        <button
          type="button"
          onClick={() => setShow(prev => !prev)}
          className={`absolute right-4  top-1/2 ${errors.password ? '-translate-y-1/2' : 'translate-y-1/2 '} text-gray-400 transition-colors`}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        className="mt-5 w-full"
      >
        Login
      </Button>
    </form>
  );
};

export default FormSignIn;
