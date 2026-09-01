'use client';

import { Plus, Trash2 } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
import Card from '../ui/card';
import Select from '../ui/select';
import useFormHelpers, { useFormItemHelpers } from '@/hooks/useFormHelpers';
import { Invoice } from '@/types/invoice';
import {
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} from '@/redux/feature/invoiceSlice';
import handleAlert from '@/lib/handleAlert';
import { Customer } from '@/types/customer';

const FormCreateInvoice = ({
  customers,
  initialInvoice,
}: {
  customers: Customer[];
  initialInvoice: Invoice | null;
}) => {
  const { form, setForm } = useFormHelpers(initialInvoice);
  const { formItem, setFormItem } = useFormItemHelpers();

  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: isLoadingUpdate }] =
    useUpdateInvoiceMutation();

  const addItem = () => {
    if (!formItem.name.trim()) {
      return handleAlert(false, 'Item name is required');
    }

    if (formItem.qty <= 0) {
      return handleAlert(false, 'Quantity must be greater than 0');
    }

    if (formItem.price <= 0) {
      return handleAlert(false, 'Price must be greater than 0');
    }
    setForm({
      ...form,
      items: [
        ...(form.items || []),
        {
          name: formItem.name,
          qty: Number(formItem.qty),
          price: Number(formItem.price),
          total: Number(formItem.qty) * Number(formItem.price),
        },
      ],
    });

    setFormItem({
      name: '',
      qty: 0,
      price: 0,
      total: 0,
    });
  };

  const removeItem = (index: number) => {
    setForm({
      ...form,
      items: form.items?.filter((item, i) => i !== index),
    });
  };

  const role = initialInvoice ? 'update' : 'create';

  const handleInvoice = async () => {
    try {
      const res =
        role === 'create'
          ? await createInvoice(form).unwrap()
          : await updateInvoice(form).unwrap();

      if (!res) return;

      handleAlert(res.success || false, res.message || 'Something went wrong!');

      if (res.success) {
        setForm({
          invoiceNo: '',
          store: '',
          customer: '',
          items: [],
          subtotal: 0,
          discount: 0,
          tax: 0,
          taxAmount: 0,
          grandTotal: 0,
          paidAmount: 0,
          dueAmount: 0,
          status: 'due',
          issueDate: new Date(),
          dueDate: null,
        });
        setFormItem({
          name: '',
          qty: 0,
          price: 0,
          total: 0,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(
        false,
        error?.data?.message || error?.error || 'Something went wrong!',
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 ">
      <Card className="flex-2 hover:bg-card! p-4 md:p-5 ">
        <p className="font-medium mb-4">Create invoice</p>

        <form>
          <Select
            label="Customer"
            value={form.customer}
            name="customerId"
            placeholder="Select customer"
            className="mb-3"
            onChange={e => setForm({ ...form, customer: e.target.value })}
          >
            <option value="">select customer</option>
            {customers.map(customer => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </Select>

          <Input
            label="Due date"
            name="dueDate"
            type="date"
            className="w-full mb-3"
            onChange={e =>
              setForm({ ...form, dueDate: new Date(e.target.value) })
            }
          />

          <div className="flex flex-col md:flex-row items-end gap-3 mb-3">
            <Input
              label="Item name"
              value={formItem.name}
              name="name"
              placeholder="Item name"
              className=""
              onChange={e => setFormItem({ ...formItem, name: e.target.value })}
            />
            <Input
              required
              label="Qty"
              type="number"
              value={formItem.qty}
              name="qty"
              placeholder="Qty"
              className=""
              onChange={e =>
                setFormItem({ ...formItem, qty: Number(e.target.value) })
              }
            />
            <Input
              required
              label="Price"
              type="number"
              value={formItem.price}
              name="price"
              placeholder="Price"
              className=""
              onChange={e =>
                setFormItem({ ...formItem, price: Number(e.target.value) })
              }
            />
            <Button onClick={addItem} variant="secondary" className="h-fit">
              <Plus size={14} />
              Add
            </Button>
          </div>
        </form>
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-4 p13 text-text">ITEM</th>
                <th className="text-center py-2 px-4 p13 text-text">QTY</th>
                <th className="text-right py-2 px-4 p13 text-text">PRICE</th>
                <th className="text-right py-2 px-4 p13 text-text">
                  SUBTTOTAL
                </th>
                <th className="text-right py-2 px-2 p13 text-text">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {form.items?.map((item, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="py-3 px-4 p13 ">{item?.name}</td>
                  <td className="py-3 px-4 text-center p13">{item?.qty}</td>
                  <td className="py-3 px-4 text-right p13">৳{item?.price}</td>
                  <td className="py-3 px-4 text-right p13">৳{item?.total}</td>
                  <td className="py-3 px-4 text-right p13">
                    <button onClick={() => removeItem(index)}>
                      <Trash2 size={18} className="text-danger" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="flex-1 hover:bg-card! rounded-xl p-4 md:p-5 h-fit">
        <p>Summary</p>

        <div className="flex justify-between p13   border-b border-border  pb-2.5 mb-2.5  text-text py-1">
          <span>Items</span>
          <span>{form.items?.length || 0}</span>
        </div>
        <div className="flex justify-between p13 border-b border-border  pb-2.5 mb-2.5 text-text py-1">
          <span>Subtotal</span>
          <span>৳{form.subtotal || 0}</span>
        </div>
        <div className="flex justify-between p13 border-b border-border  pb-2.5 mb-2.5 text-text py-1">
          <span className="w-1/2">Discount ৳</span>
          <Input
            value={form.discount}
            type="number"
            name="discount"
            className="w-2/4 text-right text-xs px-2!"
            onChange={e =>
              setForm({ ...form, discount: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex justify-between p13 text-text py-1 pb-2.5  mb-2">
          <span className="w-1/2">Tax %</span>
          <Input
            value={form.tax}
            type="number"
            name="tax"
            className="w-2/4 text-right text-xs px-2!"
            onChange={e => setForm({ ...form, tax: Number(e.target.value) })}
          />
        </div>

        <div className="flex justify-between p13 border-b border-border  pb-2.5 mb-2.5 text-text py-1">
          <span>text amount</span>
          <span>৳{form.taxAmount || 0}</span>
        </div>

        <div className="flex justify-between p13 text-text font-medium mb-3.5">
          <span>Total</span>
          <span>৳{form.grandTotal || 0}</span>
        </div>

        <div className="flex justify-between p13 text-success py-1 pb-2.5 border-b border-border mb-2.5">
          <span className="w-1/2  ">Paid ৳</span>
          <Input
            value={form.paidAmount}
            type="number"
            name="paid"
            className="w-2/4 text-right text-xs px-2!"
            onChange={e =>
              setForm({ ...form, paidAmount: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex justify-between p13 text-warning font-medium mb-3.5 bg-warningBg ">
          <span>Due</span>
          <span>৳{form.dueAmount || 0}</span>
        </div>
        <Button
          loading={isLoading || isLoadingUpdate}
          disabled={isLoading || isLoadingUpdate}
          onClick={handleInvoice}
          variant="primary"
          className="w-full"
        >
          Create invoice
        </Button>
      </Card>
    </div>
  );
};
export default FormCreateInvoice;
