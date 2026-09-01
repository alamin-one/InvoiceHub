import Store from '@/types/store';
import { StoreOverview } from '@/types/store';
//import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseApi } from './baseApi';

type StoreList = {
  message: string;
  store: Store;
  success: boolean;
};
type Overview = {
  message: string;
  store: StoreOverview;
  success: boolean;
};

export const storeApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Get store list
    getStoreList: build.query<StoreList, void>({
      query: () => '/store/me',
      providesTags: ['Store'],
    }),

    // Get store overview
    getStoreOverview: build.query<Overview, void>({
      query: () => '/store/overview',
      providesTags: ['Store'],
    }),

    // Sign in
    signIn: build.mutation({
      query: data => ({
        url: '/store/signin',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Store'],
    }),

    // Sign up
    signUp: build.mutation({
      query: data => ({
        url: '/store/signup',
        method: 'POST',
        body: data,
      }),
    }),

    // Verify sign up
    verifySignup: build.mutation({
      query: data => ({
        url: '/store/verify-signup',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Store'],
    }),

    // Sign out
    signOut: build.mutation({
      query: () => ({
        url: '/store/signout',
        method: 'POST',
      }),
    }),

    // Forgot password
    forgotPassword: build.mutation({
      query: data => ({
        url: '/store/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Verify forgot password
    verifyForgotPassword: build.mutation({
      query: data => ({
        url: '/store/verify-forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset password
    resetPassword: build.mutation({
      query: data => ({
        url: '/store/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Update profile
    updateProfile: build.mutation({
      query: data => ({
        url: '/store/update-profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Store'],
    }),

    // Update password
    updatePassword: build.mutation({
      query: data => ({
        url: '/store/update-password',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Store'],
    }),

    // Update settings
    updateSettings: build.mutation({
      query: data => ({
        url: '/store/update-settings',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Store', 'Invoice'],
    }),

    // Delete account
    deleteAccount: build.mutation({
      query: data => ({
        url: '/store/delete-account',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Store'],
    }),
  }),
});

export const {
  useGetStoreListQuery,
  useSignInMutation,
  useSignUpMutation,
  useGetStoreOverviewQuery,
  useVerifySignupMutation,
  useSignOutMutation,

  useForgotPasswordMutation,
  useVerifyForgotPasswordMutation,
  useResetPasswordMutation,

  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateSettingsMutation,
  useDeleteAccountMutation,
} = storeApi;
