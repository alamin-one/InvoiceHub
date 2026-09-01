'use client';

import Link from 'next/link';

import { Eye } from 'lucide-react';
import Card from '../ui/card';
import CustomerAbater from './CustomerAbater';
import { Customer } from '@/types/customer';
const style = {
  paid: {
    color: 'text-success',
  },
  partial: {
    color: 'text-warning',
  },
  due: {
    color: 'text-danger',
  },
};
const CustomerCard = ({ customer }: { customer: Customer }) => {
  return (
    <Link href={`/dashboard/customers/${customer?._id}`} prefetch={false}>
      <Card>
        <CustomerAbater
          name={customer?.name || null}
          phone={customer?.phone || null}
          address={null}
        />
        <div className="flex flex-wrap justify-between items-center gap-y-3 mt-3 pt-2.5 border-t border-border">
          <div>
            <p className="p10 mb-0.5">TOTAL</p>
            <p className="text-title font-medium">
              ৳ {customer?.grandTotal || 0}
            </p>
          </div>
          <div>
            <p className="p10 mb-0.5">PAID</p>
            <p className={`font-medium ${style.paid.color}`}>
              ৳ {customer?.totalPaid || 0}
            </p>
          </div>
          <div>
            <p className="p10 mb-0.5">DUE</p>
            <p className={`font-medium ${style.due.color}  `}>
              ৳ {customer?.totalDue || 0}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Eye size={18} className="" />
          </div>
        </div>
      </Card>
    </Link>
  );
};
export default CustomerCard;
