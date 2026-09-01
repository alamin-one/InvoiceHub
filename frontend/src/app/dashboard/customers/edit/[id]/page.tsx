'use client';

import { useParams } from 'next/navigation';

import CreateCustomerForm from '@/components/shared/CreateCustomerForm';
import SectionBar from '@/components/shared/SectionBar';
import { useGetCustomerByIdQuery } from '@/redux/feature/customerSlice';

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const { data } = useGetCustomerByIdQuery(id);

  return (
    <section className="app-container">
      <SectionBar title="Edit customer" description="Edit a customer." />

      <CreateCustomerForm initialValues={data?.customer || {}} />
    </section>
  );
};

export default Page;
