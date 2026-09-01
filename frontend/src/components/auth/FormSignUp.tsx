'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { SignUpFormData } from '@/types/signup';
import handleAlert from '@/lib/handleAlert';
import { useSignUpMutation } from '@/redux/feature/storeSlice';

const FormSignUp = () => {
  const route = useRouter();

  const [signUp, { isLoading }] = useSignUpMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const res = await signUp(data).unwrap();
      if (!res) return;
      handleAlert(
        res.success,
        res.message || 'Verification code sent successfully',
      );
      if (res.success) {
        route.push('/verify');
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full px-1">
      <Input
        type="text"
        label="Name"
        placeholder="Name"
        {...register('name', {
          required: 'Name is required',
        })}
        error={errors.name}
      />
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
        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="••••••••"
          {...register('password', {
            required: 'Password is required',
          })}
          error={errors.password}
        />{' '}
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className={`absolute right-3  top-1/2 ${errors.password ? '-translate-y-1/2' : 'translate-y-1/2 '} text-gray-400 transition-colors`}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="relative w-full ">
        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="••••••••"
          {...register('confirmPassword', {
            required: 'Password is required',
          })}
          error={errors.confirmPassword}
        />{' '}
        <button
          type="button"
          onClick={() => setShowConfirmPassword(prev => !prev)}
          className={`absolute right-3  top-1/2 ${errors.password ? '-translate-y-1/2' : 'translate-y-1/2 '} text-gray-400 transition-colors`}
        >
          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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

export default FormSignUp;
