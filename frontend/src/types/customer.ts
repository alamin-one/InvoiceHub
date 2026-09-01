import { Invoice } from './invoice';

export type Customer = {
  _id?: string;
  name?: string;
  phone?: string;
  address?: string;
  grandTotal?: number;
  invoiceCount?: number;
  totalPaid?: number;
  totalDue?: number;
  partialCount?: number;
  invoices?: Invoice[];
};
