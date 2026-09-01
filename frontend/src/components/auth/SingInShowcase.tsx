import Link from 'next/link';
import { BarChart3, Receipt } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Sales overview',
    description: 'See your growth with charts',
    iconColor: '#514bb3',
    iconBg: 'rgba(127, 119, 221, 0.15)',
  },
  {
    icon: Receipt,
    title: 'Effortless invoices',
    description: 'Create an invoice in a few clicks',
    iconColor: '#59b287',
    iconBg: 'rgba(29, 158, 117, 0.15)',
  },
];

const SingInShowcase = () => {
  return (
    <div className="hidden w-full md:w-1/2 md:flex flex-col items-start justify-start gap-5 md:p-10">
      <div className="flex gap-2">
        <div className="w-10 h-10 bg-title-secondary rounded-xl text-background dark:text-title  flex justify-center items-center text-2xl font-bold">
          IH
        </div>
        <div className="">
          <h4>InvoiceHub</h4>
          <p className="p13 leading-0 mt-2">Store Billing Manager</p>
        </div>
      </div>

      <div className="text-start ">
        <h3>Your store&apos;s billing, fully in control.</h3>
        <p className="mt-2">
          Create invoices, track payments, and manage customers — all in one
          place.
        </p>
      </div>

      <div className="flex flex-col gap-3.5 w-full">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className={`flex items-center gap-3 pb-3 w-full ${
              i !== features.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: feature.iconBg }}
            >
              <feature.icon size={16} color={feature.iconColor} />
            </div>
            <div>
              <p className="p13 text-title ">{feature.title}</p>
              <p className="p13  ">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="">
        <p className="hidden md:block p13">
          developed by{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://alaminhosen.vercel.app/"
            className="text-title-secondary p13"
          >
            MD.Al-Amin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SingInShowcase;
