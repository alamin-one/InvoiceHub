'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

import { MenuIcon, Plus, X } from 'lucide-react';
import Button from '../ui/button';

const DashboardHeader = ({
  onToggle,
  isOpen,
}: {
  onToggle: () => void;
  isOpen: boolean;
}) => {
  return (
    <div className="sticky top-0 left-0 right-0 px-5 py-3 flex justify-between items-center bg-card z-10">
      <Link href={'/dashboard'}>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-title-secondary rounded-xl text-background dark:text-title  flex justify-center items-center text-2xl font-bold">
            IH
          </div>
          <div className="">
            <h4>InvoiceHub</h4>
            <p className="p13 leading-0 mt-2">Store Billing Manager</p>
          </div>
        </div>
      </Link>
      <div className="flex justify-center items-center gap-2">
        <Link href="/dashboard/invoices/add" className="hidden md:block ">
          <Button variant="secondary" className="w-full md:w-fit h-fit mr-5">
            <Plus size={16} /> Create Invoice
          </Button>
        </Link>
        <ThemeToggle />
        <button
          className="md:hidden p-1.5 border border-border rounded-md cursor-pointer"
          onClick={onToggle}
        >
          {isOpen ? <X size={27} /> : <MenuIcon size={27} />}
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
