import Input from '../ui/input';
import Textarea from '../ui/textarea';
import Button from '../ui/button';
import Store from '@/types/store';
import { useUpdateSettingsMutation } from '@/redux/feature/storeSlice';
import handleAlert from '@/lib/handleAlert';

const StoreSettings = ({ store }: { store: Store }) => {
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());

    try {
      const res = await updateSettings(data).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message || '');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(
        false,
        error?.data?.message || error?.error || 'something went wrong!!',
      );
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h4 className=" ">Invoice Settings</h4>
      <p className="p13">
        Controls how new invoice numbers and due dates are generated.
      </p>

      <div className="border-t border-border mt-5 pt-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-5 ">
          <Input
            label="Invoice Prefix"
            placeholder="INV-"
            name="invoicePrefix"
            defaultValue={store?.invoicePrefix || 'INV-'}
          />
          <Input
            label="Next Invoice Number"
            placeholder="2042"
            type="number"
            name="nextInvoiceNumber"
            defaultValue={store?.nextInvoiceNumber || 2026}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 ">
          <Input
            label="Default text"
            placeholder="0"
            type="number"
            name="defaultTax"
            defaultValue={store?.defaultTax || 0}
          />
          <Input
            label="Default Due Period (days)"
            placeholder="30"
            type="number"
            name="defaultDuePeriod"
            defaultValue={store?.defaultDuePeriod || 30}
          />
        </div>
        <Input
          label="Currency Symbol"
          placeholder="৳"
          name="currencySymbol"
          defaultValue={store?.currencySymbol || '৳'}
        />
        <Textarea
          label="Invoice Footer Note"
          placeholder="Thank you for your business!"
          name="invoiceFooterNote"
          defaultValue={
            store?.invoiceFooterNote || 'Thank you for your business!'
          }
        />

        <Button
          disabled={isLoading}
          loading={isLoading}
          type="submit"
          className="w-fit"
        >
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default StoreSettings;
