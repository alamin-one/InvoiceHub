'use client';

import { useSearchParams } from 'next/navigation';

import CustomerCard from '@/components/shared/CustomerCard';
import { useGetCustomerListQuery } from '@/redux/feature/customerSlice';
import Loading from '@/lib/Loading';
import NotFound from '@/lib/NotFound';

const PageClient = () => {
  const params = useSearchParams();
  const search = params.get('search') || '';

  const { data, isLoading, isError } = useGetCustomerListQuery({ search });

  if (isLoading) {
    return <Loading />;
  }
  if (isError || !data?.customer) {
    return <NotFound message="Invoice not found" />;
  }

  const customer = data?.customer || [];
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customer.map(item => (
          <CustomerCard key={item?._id} customer={item} />
        ))}
      </div>
    </>
  );
};

export default PageClient;
