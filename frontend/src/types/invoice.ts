import { Customer } from './customer';
import Store from './store';

export type InvoiceItem = {
  _id?: string;
  name: string;
  qty: number;
  price: number;
  total: number;
};
type InvoiceStatus = 'paid' | 'partial' | 'due';
export interface Invoice {
  _id?: string;
  invoiceNo?: string;
  store?: Store;
  customer?: Customer;
  customerName?: string | null;
  items?: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date | null;
}
export interface InvoiceCreate {
  _id?: string;
  invoiceNo?: string;
  store?: string;
  customer?: string;
  items?: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax?: number;
  taxAmount?: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date | null;
}

export interface InvoiceUpdate {
  _id?: string;
  invoiceNo?: string;
  store?: string;
  customer?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  discount?: number;
  tax?: number;
  taxAmount?: number;
  grandTotal?: number;
  paidAmount?: number;
  dueAmount?: number;
  status?: InvoiceStatus;
  issueDate?: Date;
  dueDate?: Date | null;
}
