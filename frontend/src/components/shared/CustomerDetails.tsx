'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import CustomerAbater from '@/components/shared/CustomerAbater';
import InvoiceCard from '@/components/shared/InvoiceCard';
import MiniCard from '@/components/shared/MiniCard';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import handleAlert from '@/lib/handleAlert';
import {
  useDeleteCustomerMutation,
  useGetCustomerByIdQuery,
} from '@/redux/feature/customerSlice';
import { Invoice } from '@/types/invoice';
import Loading from '@/lib/Loading';
import NotFound from '@/lib/NotFound';

const CustomerDetails = () => {
  const params = useParams();
  const route = useRouter();

  const id = params.id as string;

  const { data, isLoading, isError } = useGetCustomerByIdQuery(id);
  const [deleteCustomer] = useDeleteCustomerMutation();

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteCustomer(id).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message || 'Customer deleted');
      if (res.success) {
        route.push('/dashboard/customers');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(
        false,
        error?.data?.message || error?.error || 'something went wrong',
      );
    }
  };

  if (isLoading) return <Loading />;

  if (!data?.customer || isError) return <NotFound />;
  const customer = data?.customer;

  return (
    <>
      {/* Customer Details */}
      <Card className="hover:bg-card!">
        <div className="flex items-start justify-between">
          <CustomerAbater
            name={customer?.name || null}
            phone={customer?.phone || null}
            address={customer?.address || null}
          />
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleDelete(id)}
              variant="secondary"
              size="sm"
              className="px-2!"
            >
              <Trash2 className="h-3.5 w-3.5 text-danger" />
            </Button>
            <Link href={`/dashboard/customers/edit/${id}`}>
              <Button variant="secondary" size="sm" className="px-2!">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MiniCard
            title="Invoices"
            value={customer?.invoices?.length || '0'}
          />
          <MiniCard title="Total paid" value={customer?.totalPaid || '0'} />
          <MiniCard title="Total due" value={customer?.totalDue || '0'} />
          <MiniCard title="Partial" value={customer?.partialCount || '0'} />
        </div>
      </Card>

      {/* Invoice Status */}

      {customer?.invoices ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {customer?.invoices.map((invoice: Invoice) => (
            <InvoiceCard
              key={invoice._id}
              invoice={invoice as Invoice}
              customerName={customer?.name || null}
            />
          ))}
        </div>
      ) : null}
    </>
  );
};

export default CustomerDetails;
