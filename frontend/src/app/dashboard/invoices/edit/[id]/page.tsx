'use client';

import { useParams } from 'next/navigation';

import FormCreateInvoice from '@/components/shared/FormCreateInvoice';
import SectionBar from '@/components/shared/SectionBar';
import { useGetCustomerListQuery } from '@/redux/feature/customerSlice';
import { useGetInvoiceByIdQuery } from '@/redux/feature/invoiceSlice';
import Loading from '@/components/shared/Loading';

const Page = () => {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading: customerLoading } = useGetCustomerListQuery({});
  const { data: invoiceData, isLoading: invoiceLoading } =
    useGetInvoiceByIdQuery(id);

  const customers = data?.customer || [];
  const invoice = invoiceData?.invoice;

  return (
    <section className="max-w-300 mx-auto p-5">
      <SectionBar title="Edit invoice" description="Edit a invoice." />

      {customerLoading || invoiceLoading ? (
        <Loading />
      ) : (
        <FormCreateInvoice
          key={id}
          customers={customers}
          initialInvoice={invoice || null}
        />
      )}
    </section>
  );
};

export default Page;
