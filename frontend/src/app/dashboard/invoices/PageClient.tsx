'use client';

import { useSearchParams } from 'next/navigation';

import InvoiceCard from '@/components/shared/InvoiceCard';
import { useGetInvoiceListQuery } from '@/redux/feature/invoiceSlice';
import Loading from '@/components/shared/Loading';
import NotFound from '@/components/shared/NotFound';

const PageClient = () => {
  const params = useSearchParams();
  const status = params.get('status') || '';
  const search = params.get('search') || '';
  const { data, isLoading, isError } = useGetInvoiceListQuery({
    status,
    search,
  });
  const invoices = data?.invoice || [];

  if (isLoading) {
    return <Loading />;
  }
  if (isError || !data?.invoice) {
    return <NotFound message="Invoice not found" />;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {invoices.map(invoice => (
        <InvoiceCard key={invoice._id} invoice={invoice} customerName={null} />
      ))}
    </div>
  );
};

export default PageClient;
