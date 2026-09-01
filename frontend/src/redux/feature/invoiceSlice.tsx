import { Invoice, InvoiceCreate, InvoiceUpdate } from '@/types/invoice';

import { baseApi } from './baseApi';

type InvoiceList = {
  message: string;
  invoice: Invoice[];
  success: boolean;
};
type SingleInvoice = {
  message: string;
  invoice?: Invoice;
  success: boolean;
};
type InvoiceCreated = {
  message: string;
  invoice?: InvoiceCreate;
  success: boolean;
};
type InvoiceUpdated = {
  message: string;
  invoice?: InvoiceUpdate;
  success: boolean;
};
type InvoiceQueryParams = {
  search?: string;
  status?: string;
  limit?: number | string;
};

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Get invoice list
    getInvoiceList: build.query<InvoiceList, InvoiceQueryParams>({
      query: params => {
        const query = new URLSearchParams();
        if (params?.search) {
          query.set('search', params.search);
        }
        if (params?.status) {
          query.set('status', params.status);
        }
        if (params?.limit) {
          query.set('limit', params.limit.toString());
        }
        return {
          url: `/invoice?${query.toString().toLocaleLowerCase()}`,
          method: 'GET',
        };
      },
      providesTags: ['Invoice'],
    }),

    // Get invoice by id
    getInvoiceById: build.query<SingleInvoice, string>({
      query: id => ({
        url: `/invoice/${id}`,
        method: 'GET',
      }),
      providesTags: ['Invoice'],
    }),

    // Create invoice
    createInvoice: build.mutation<InvoiceCreated, InvoiceCreate>({
      query: data => ({
        url: '/invoice',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Invoice', 'Customer', 'Store'],
    }),

    // Update invoice
    updateInvoice: build.mutation<InvoiceUpdated, InvoiceUpdate>({
      query: data => ({
        url: `/invoice/${data._id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Invoice', 'Customer'],
    }),

    // Delete invoice
    deleteInvoice: build.mutation<
      { message: string; success: boolean },
      string
    >({
      query: id => ({
        url: `/invoice/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invoice'],
    }),

    // Download invoice
    invoiceDownload: build.mutation<Blob, Invoice>({
      query: invoiceData => ({
        url: `/invoice/download`,
        method: 'POST',
        body: invoiceData,
        responseHandler: async response => await response.blob(),
        cache: 'no-cache',
      }),
    }),
  }),
});

export const {
  useGetInvoiceListQuery,
  useCreateInvoiceMutation,
  useGetInvoiceByIdQuery,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useInvoiceDownloadMutation,
} = invoiceApi;
