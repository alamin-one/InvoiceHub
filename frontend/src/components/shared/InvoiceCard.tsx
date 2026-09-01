'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import Card from '../ui/card';
import { Invoice } from '@/types/invoice';

const statusStyles = {
  paid: {
    bg: 'bg-successBg',
    color: 'text-success',
    label: 'text-muted',
  },
  partial: {
    bg: 'bg-warningBg',
    color: 'text-warning',
    label: 'text-warning',
  },
  due: {
    bg: 'bg-dangerBg',
    color: 'text-danger',
    label: 'text-danger',
  },
};

const InvoiceCard = ({
  invoice,
  customerName,
}: {
  invoice: Invoice;
  customerName?: string | null;
}) => {
  const style = statusStyles[invoice?.status || 'paid'];

  return (
    <Link href={`/dashboard/invoices/${invoice._id}`} className="w-full">
      <Card className="w-full">
        <div className="flex justify-between items-center text-title">
          <span className="text-sm font-semibold">{invoice.invoiceNo}</span>
          <span
            className={`p10 capitalize px-2.5 py-1 rounded-full ${style.color} ${style.bg}`}
          >
            {invoice.status || 'Paid'}
          </span>
        </div>

        <p className="p13 mb-3">
          <span className="text-text">
            {customerName || invoice?.customerName}
          </span>
          <br />
          {new Date(invoice?.issueDate).toDateString()}
        </p>

        <div className="flex flex-wrap justify-between items-center gap-y-3 pt-2.5 border-t border-border">
          <div>
            <p className="p10 mb-0.5">TOTAL</p>
            <p className="text-title font-medium"> ৳{invoice.grandTotal}</p>
          </div>
          <div>
            <p className="p10 mb-0.5">PAID</p>
            <p className={`font-medium ${style.color}`}>
              ৳{invoice.paidAmount}
            </p>
          </div>
          <div>
            <p className="p10 mb-0.5">DUE</p>
            <p className={`font-medium ${style.label}`}>৳{invoice.dueAmount}</p>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Eye size={18} className="" />
          </div>
        </div>
      </Card>
    </Link>
  );
};
export default InvoiceCard;
