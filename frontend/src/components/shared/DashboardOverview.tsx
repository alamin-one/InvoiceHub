'use client';
import { useGetInvoiceListQuery } from '@/redux/feature/invoiceSlice';
import InvoiceCard from './InvoiceCard';
import { useGetStoreOverviewQuery } from '@/redux/feature/storeSlice';
import StatCard from './StatCard';

import InvoiceStatusChart from '@/components/shared/InvoiceStatusChart';
import SalesOverviewChart from '@/components/shared/SalesOverviewChart';
import Card from '@/components/ui/card';
import Label from '@/components/ui/Label';

import { AlertCircle, FileText, TrendingUp, Wallet } from 'lucide-react';
import Loading from '@/components/shared/Loading';
import NotFound from '@/components/shared/NotFound';
const DashboardOverview = () => {
  const limit = 6;
  const { data, isLoading, isError } = useGetInvoiceListQuery({ limit });
  const { data: storeData } = useGetStoreOverviewQuery();

  const store = storeData?.store || {};

  const invoices = data?.invoice || [];
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={TrendingUp}
          label="Total Sales"
          amount={`৳${store?.grandTotal || 0}`}
          changePercent={store?.grandTotalChange || 0}
          iconColor="#00966D"
          iconBg="rgba(0, 150, 109, 0.12)"
        />
        <StatCard
          icon={Wallet}
          label="Paid"
          amount={`৳${store?.totalPaid || 0}`}
          changePercent={store?.totalPaidChange || 0}
          iconColor="#00966D"
          iconBg="rgba(0, 150, 109, 0.12)"
        />
        <StatCard
          icon={AlertCircle}
          label="Due"
          amount={`৳${store?.totalDue || 0}`}
          changePercent={store?.totalDueChange || 0}
          iconColor="#E9524A"
          iconBg="rgba(233, 82, 74, 0.12)"
        />
        <StatCard
          icon={FileText}
          label="Invoices"
          amount={`${store?.invoiceCount || 0}`}
          changePercent={store?.invoiceCountChange || 0}
          iconColor="#514BB3"
          iconBg="rgba(81, 75, 179, 0.12)"
        />
      </div>

      {/* Recent Overview */}
      <div className="flex flex-col lg:flex-row justify-between items-center my-3 gap-3">
        <Card className="w-full">
          <Label>Recent Overview</Label>
          <div className="mt-5">
            <SalesOverviewChart data={store?.monthlySales || []} />
          </div>
        </Card>
        <Card className="w-full lg:w-1/2">
          <Label>Invoice Status</Label>
          <div className="mt-5">
            <InvoiceStatusChart
              data={{
                paid: store?.totalPaidCount || 0,
                partiallyPaid: store?.partialCount || 0,
                due: store?.totalDueCount || 0,
              }}
            />
          </div>
        </Card>
      </div>

      {/* Recent invoice */}
      <Label>Recent Invoices</Label>
      <div className="grid grid-cols-1  md:grid-cols-2 gap-3 mt-3">
        {isLoading ? (
          <Loading />
        ) : isError && data?.invoice.length === 0 ? (
          <NotFound />
        ) : (
          invoices.map(invoice => (
            <InvoiceCard key={invoice._id} invoice={invoice} />
          ))
        )}
      </div>
    </>
  );
};

export default DashboardOverview;
