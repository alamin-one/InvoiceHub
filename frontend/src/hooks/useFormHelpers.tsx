'use client';

import { Invoice, InvoiceCreate } from '@/types/invoice';
import { useMemo, useState } from 'react';

const calculateTotals = (
  items: InvoiceCreate['items'],
  discount = 0,
  tax = 0,
  paidAmount = 0,
) => {
  const subtotal =
    items?.reduce((sum, item) => sum + item.qty * item.price, 0) || 0;
  const taxAmount = Math.round(subtotal * (tax / 100));
  const grandTotal = subtotal - discount + taxAmount;
  const dueAmount = grandTotal - paidAmount;
  const status =
    paidAmount >= grandTotal && grandTotal > 0
      ? ('paid' as const)
      : paidAmount > 0
        ? ('partial' as const)
        : ('due' as const);

  return { subtotal, taxAmount, grandTotal, dueAmount, status };
};

const buildFormFromInvoice = (inv: Invoice): InvoiceCreate => ({
  _id: inv._id,
  invoiceNo: inv.invoiceNo,
  store: inv.store?._id,
  customer: inv.customer?._id,
  items: inv.items,
  subtotal: inv.subtotal,
  discount: inv.discount,
  tax: inv.tax,
  taxAmount: inv.taxAmount,
  grandTotal: inv.grandTotal,
  paidAmount: inv.paidAmount,
  dueAmount: inv.dueAmount,
  status: inv.status,
  issueDate: inv.issueDate,
  dueDate: inv.dueDate,
});

const defaultForm: InvoiceCreate = {
  invoiceNo: '',
  store: '',
  customer: '',
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  taxAmount: 0,
  grandTotal: 0,
  paidAmount: 0,
  dueAmount: 0,
  status: 'due',
  issueDate: new Date(),
  dueDate: null,
};

const useFormHelpers = (initialInvoice: Invoice | null) => {
  const [form, setForm] = useState<InvoiceCreate>(() =>
    initialInvoice ? buildFormFromInvoice(initialInvoice) : defaultForm,
  );
  const [prevInvoice, setPrevInvoice] = useState(initialInvoice);

  if (initialInvoice !== prevInvoice) {
    setPrevInvoice(initialInvoice);
    if (initialInvoice) {
      setForm(buildFormFromInvoice(initialInvoice));
    }
  }

  const totals = useMemo(
    () => calculateTotals(form.items, form.discount, form.tax, form.paidAmount),
    [form.items, form.discount, form.tax, form.paidAmount],
  );

  return {
    form: { ...form, ...totals },
    setForm,
  };
};

export default useFormHelpers;

export const useFormItemHelpers = () => {
  const [formItem, setFormItem] = useState({
    name: '',
    qty: 1,
    price: 0,
    total: 0,
  });

  return {
    formItem: { ...formItem, total: formItem.qty * formItem.price },
    setFormItem,
  };
};
