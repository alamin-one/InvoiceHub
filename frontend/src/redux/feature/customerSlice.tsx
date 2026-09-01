import { Customer } from '@/types/customer';
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseApi } from './baseApi';

type CustomerList = {
  message: string;
  customer?: Customer[];
  success: boolean;
};
type CustomerById = {
  message: string;
  customer?: Customer;
  success: boolean;
};
type CustomerQueryParams = {
  search?: string;
};

export const customerApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Get customer list
    getCustomerList: build.query<CustomerList, CustomerQueryParams>({
      query: params => {
        const query = new URLSearchParams();
        if (params?.search) {
          query.set('search', params.search);
        }
        return {
          url: `/customer?${query.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Customer'],
    }),

    // Get customer by id
    getCustomerById: build.query<CustomerById, string>({
      query: id => ({
        url: `/customer/${id}`,
        method: 'GET',
      }),
      providesTags: ['Customer'],
    }),

    // Create customer
    createCustomer: build.mutation<CustomerById, Customer>({
      query: data => ({
        url: '/customer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Customer'],
    }),

    updateCustomer: build.mutation<CustomerById, Customer>({
      query: data => ({
        url: `/customer/${data._id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Customer'],
    }),

    // Delete customer
    deleteCustomer: build.mutation<   { message: string; success: boolean }, string >({
      query: id => ({
        url: `/customer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),
  }),
});

export const {
  useGetCustomerListQuery,
  useCreateCustomerMutation,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
