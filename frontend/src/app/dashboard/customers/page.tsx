import { Suspense } from 'react';
import Link from 'next/link';

import SectionBar from '@/components/shared/SectionBar';
import Button from '@/components/ui/button';
import PageClient from './PageClient';
import CustomerFilter from '@/components/shared/CustomerFilter';
import Loading from '@/lib/Loading';

const page = async () => {
  return (
    <section className="app-container">
      <div className="w-full flex flex-col md:flex-row justify-between items-start">
        <SectionBar
          title="Customers"
          description="A quick snapshot of my customers."
        />
        <Link href="/dashboard/customers/add" className="w-full md:w-fit">
          <Button className="w-full md:w-fit h-fit mb-5">
            Create Customer
          </Button>
        </Link>
      </div>
      <Suspense fallback={<Loading />}>
        <CustomerFilter />
      </Suspense>
      {/* Customer Card */}
      <Suspense fallback={<Loading />}>
        <PageClient />
      </Suspense>
    </section>
  );
};

export default page;
