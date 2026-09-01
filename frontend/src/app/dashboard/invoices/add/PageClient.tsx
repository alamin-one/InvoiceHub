'use client';

import FormCreateInvoice from '@/components/shared/FormCreateInvoice';
import { useGetCustomerListQuery } from '@/redux/feature/customerSlice';

const PageClient = () => {
  const { data } = useGetCustomerListQuery({});
  const customerList = data?.customer || [];

  return (
    <>
      <FormCreateInvoice customers={customerList} initialInvoice={null} />
    </>
  );
};

export default PageClient;
