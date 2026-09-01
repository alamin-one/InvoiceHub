type Logo = {
  url: string;
  public_id: string;
};

type Store = {
  _id?: string;
  logo?: Logo;
  name?: string;
  tagline?: string;
  address?: string;
  phone?: string;

  email?: string;
  password?: string;

  invoicePrefix?: string;
  nextInvoiceNumber?: number;
  defaultTax?: number;
  currencySymbol?: string;
  defaultDuePeriod?: number;
  invoiceFooterNote?: string;
};

export default Store;

type MonthlyOverviewSales = {
  month: string;
  total: number;
};

export type StoreOverview = {
  _id?: string;
  grandTotal?: number;
  invoiceCount?: number;
  totalDue?: number;
  totalPaid?: number;
  totalDueChange?: number;
  totalPaidChange?: number;
  grandTotalChange?: number;
  invoiceCountChange?: number;

  partialCount?: number;
  totalPaidCount?: number;
  totalDueCount?: number;
  monthlySales?: MonthlyOverviewSales[];
};
