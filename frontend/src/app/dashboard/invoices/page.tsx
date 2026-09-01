import { Suspense } from 'react';
import Link from 'next/link';

import InvoiceFilter from '@/components/shared/InvoiceFilter';
import SectionBar from '@/components/shared/SectionBar';
import Button from '@/components/ui/button';
import PageClient from './PageClient';
import Loading from '@/components/shared/Loading';

const page = async () => {
  return (
    <section className="app-container">
      <div className="w-full flex flex-col md:flex-row justify-between items-start">
        <SectionBar
          title="Invoices"
          description="A quick snapshot of my invoices."
        />
        <Link href="/dashboard/invoices/add" className="w-full md:w-fit">
          <Button className="w-full md:w-fit h-fit mb-5">Create Invoice</Button>
        </Link>
      </div>
      <Suspense fallback={<Loading />}>
        <InvoiceFilter />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <PageClient />
      </Suspense>
    </section>
  );
};

export default page;
