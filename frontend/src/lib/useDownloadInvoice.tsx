'use client';
import { useInvoiceDownloadMutation } from '@/redux/feature/invoiceSlice';
import { Invoice } from '@/types/invoice';
import handleAlert from './handleAlert';

const useInvoiceDownload = () => {
  const [invoiceDownload, { isLoading }] = useInvoiceDownloadMutation();

  const downloadInvoice = async (invoice: Invoice) => {
    try {
      const blob = await invoiceDownload(invoice).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice?.invoiceNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(
        false,
        error?.data?.message || error?.error || 'Download failed',
      );
    }
  };

  return { downloadInvoice, isLoading };
};

export default useInvoiceDownload;
