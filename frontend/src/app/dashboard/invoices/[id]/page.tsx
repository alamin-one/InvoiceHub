'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import Button from '@/components/ui/button';
import { Download, Pencil, Printer, Trash2 } from 'lucide-react';
import Input from '@/components/ui/input';
import handleAlert from '@/lib/handleAlert';

import {
  useDeleteInvoiceMutation,
  useGetInvoiceByIdQuery,
  useUpdateInvoiceMutation,
} from '@/redux/feature/invoiceSlice';
import Loading from '@/components/shared/Loading';
import NotFound from '@/components/shared/NotFound';
import useInvoiceDownload from '@/lib/useDownloadInvoice';

const statusStyles = {
  paid: { color: 'text-success', bg: 'bg-successBg' },
  partial: { color: 'text-warning', bg: 'bg-warningBg' },
  due: { color: 'text-danger', bg: 'bg-dangerBg' },
};

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // download invoice
  const { downloadInvoice, isLoading: downloadLoading } = useInvoiceDownload();

  // Update invoice
  const [updateInvoice, { isLoading: updateLoading }] =
    useUpdateInvoiceMutation();

  // Get invoice by id
  const { data, isLoading, isError } = useGetInvoiceByIdQuery(id as string);

  // Delete invoice
  const [deleteInvoice, { isLoading: deleteLoading }] =
    useDeleteInvoiceMutation();

  if (isLoading) {
    return <Loading />;
  }
  if (isError || !data?.invoice) {
    return <NotFound message="Invoice not found" />;
  }

  const invoice = data?.invoice;
  const style = statusStyles[invoice?.status || 'paid'];
  const disable = Number(invoice?.dueAmount) <= 0;

  // Handle payment
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const receivedAmount: number = Number(formData.get('receivedAmount'));
    if (!receivedAmount) return;

    const paidAmount =
      Number(invoice?.paidAmount || 0) + Number(receivedAmount);

    const dueAmount = Number(invoice?.dueAmount || 0) - Number(receivedAmount);
    const status =
      paidAmount >= invoice?.grandTotal && invoice?.grandTotal > 0
        ? ('paid' as const)
        : paidAmount > 0
          ? ('partial' as const)
          : ('due' as const);

    const data = {
      _id: id,
      status,
      paidAmount,
      dueAmount,
    };

    try {
      const res = await updateInvoice(data).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message || 'Payment successful');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(false, error.data.message || error.message);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteInvoice(id).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message || 'Delete successful');
      if (res.success) {
        router.push('/dashboard/invoices');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(false, error.data.message || error.message);
    }
  };

  return (
    <>
      <section className="p-5 py-6 max-w-300 mx-auto">
        <div className="flex flex-wrap justify-start md:justify-end items-center gap-2 mb-5">
          <Link href={`/dashboard/invoices/edit/${id}`}>
            <Button variant="secondary" size="sm" className="px-1.5!">
              <Pencil size={16} /> Edit
            </Button>
          </Link>
          <Button variant="secondary" size="sm" className="px-1.5!">
            <Printer size={16} /> Print
          </Button>
          <Button
            onClick={() => downloadInvoice(invoice)}
            variant="secondary"
            size="sm"
            className="px-1.5!"
            disabled={downloadLoading}
          >
            {downloadLoading ? (
              <> Loading </>
            ) : (
              <>
                <Download size={16} /> PDF
              </>
            )}
          </Button>
          <Button
            onClick={() => handleDelete(invoice?._id || '')}
            variant="secondary"
            size="sm"
            className="px-1.5!"
            disabled={deleteLoading}
          >
            <Trash2 size={16} /> Delete
          </Button>
        </div>

        <div className="w-full ">
          <h4 className="text-2xl mb-5">INVOICE : {invoice?.invoiceNo}</h4>

          <div className="">
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mb-6">
              <div>
                <p className="p13">FROM</p>
                <h4>{invoice?.store?.name}</h4>
                <p className="p13 text-text">{invoice?.store?.address}</p>
                <p className="p13 text-text">{invoice?.store?.phone}</p>
                <p className="p13 text-text">{invoice?.store?.email}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="p13">BILL TO</p>
                <h4>{invoice?.customer?.name}</h4>
                <p className="p13 text-text">{invoice?.customer?.phone}</p>
                <p className="p13 text-text">{invoice?.customer?.address}</p>
              </div>
            </div>

            {/* Date strip */}
            <div className="flex flex-wrap justify-between gap-3 bg-card  px-4 py-3 mb-6">
              <div>
                <p className="p13 text-text">Invoice date</p>
                <p className="p10 text-title">
                  {new Date(invoice?.issueDate).toDateString()}
                </p>
              </div>
              <div>
                <p className="p13 text-text">Due date</p>
                <p className="p10 text-title">
                  {invoice.dueDate
                    ? new Date(invoice?.dueDate).toDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="p13 text-text">Payment status</p>
                <span
                  className={`capitalize p10 px-2 py-0.5 rounded-full ${style.color} ${style.bg}`}
                >
                  {invoice?.status || 'Paid'}
                </span>
              </div>
            </div>

            {/* Items table */}
            <div className="overflow-x-auto mb-5">
              <table className="w-full ">
                <thead>
                  <tr className="bg-card">
                    <th className="text-left py-2.5 px-3 p13 text-text">
                      ITEM
                    </th>
                    <th className="text-center py-2.5 px-3 p13 text-text">
                      QTY
                    </th>
                    <th className="text-right py-2.5 px-3 p13 text-text">
                      UNIT PRICE
                    </th>
                    <th className="text-right py-2.5 px-3 p13 text-text">
                      TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice?.items?.map((item, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="px-2 py-1">
                        <p className="text-sm text-text m-0">{item.name}</p>
                      </td>
                      <td className="px-2 py-1 text-center text-sm text-text">
                        {item.qty}
                      </td>
                      <td className="px-2 py-1 text-right text-sm text-text">
                        ৳{item.price}
                      </td>
                      <td className="px-2 py-1 text-right text-sm text-text">
                        ৳{item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-full md:w-md">
                <div className="flex justify-between py-1">
                  <span className="p13 text-text">Subtotal</span>
                  <span className="p13 text-title">৳{invoice?.subtotal}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="p13 text-text">Discount</span>
                  <span className="p13 text-danger">
                    − ৳{invoice?.discount}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="p13 text-text">Tax</span>
                  <span className="p13 text-title">৳{invoice?.tax}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-border mt-1">
                  <span className="p13 text-title">Grand Total</span>
                  <span className="p13 text-title">৳{invoice?.grandTotal}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="p13 text-success">Paid</span>
                  <span className="p13 text-success">
                    ৳{invoice?.paidAmount}
                  </span>
                </div>
                {!disable ? (
                  <div className="flex justify-between items-center px-3 py-2 mt-2 bg-warningBg">
                    <span className="p13 text-warning">Amount Due</span>
                    <span className="p13 text-title">
                      ৳{invoice?.dueAmount}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Record */}
        {!disable ? (
          <div className="flex justify-end mb-6">
            <div className="flex-1  w-full md:max-w-md  mt-10  pt-5 border-t border-border">
              <p className="p13 text-title mb-3">Record payment</p>

              <div className="flex justify-between py-1.5 text-xs">
                <span className="p13 text-text-secondary">Total</span>
                <span className="p13 text-title">৳{invoice?.grandTotal}</span>
              </div>
              <div className="flex justify-between py-1.5 text-xs">
                <span className="p13 text-success">Paid</span>
                <span className="p13 text-success">৳{invoice?.paidAmount}</span>
              </div>
              <div className="flex justify-between py-1.5 pb-3 text-xs border-b border-border mb-3">
                <span className="p13 text-warning">Due</span>
                <span className="p13 text-warning">৳{invoice?.dueAmount}</span>
              </div>

              <label className="p13 text-text-secondary block mb-1.5">
                Amount received
              </label>
              <form onSubmit={handleSubmit}>
                <Input
                  type="number"
                  name="receivedAmount"
                  placeholder="Enter amount received"
                  className="w-full mb-3 "
                />

                <Button
                  type="submit"
                  className="w-full p13 text-title"
                  disabled={updateLoading}
                >
                  Confirm payment
                </Button>
              </form>
            </div>{' '}
          </div>
        ) : null}
      </section>

      <section></section>
    </>
  );
};

export default Page;
