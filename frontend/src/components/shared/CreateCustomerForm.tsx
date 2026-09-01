'use client';

import { useRouter } from 'next/navigation';
import { Customer } from '@/types/customer';

import Card from '../ui/card';
import Input from '../ui/input';
import Textarea from '../ui/textarea';
import Button from '../ui/button';
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from '@/redux/feature/customerSlice';
import handleAlert from '@/lib/handleAlert';

const CreateCustomerForm = ({
  initialValues,
}: {
  initialValues: Customer | null;
}) => {
  const route = useRouter();

  // create customer
  const [createCustomer, { isLoading: createLoading }] =
    useCreateCustomerMutation();

  // update customer
  const [updateCustomer, { isLoading: updateLoading }] =
    useUpdateCustomerMutation();

  const action = initialValues ? 'Edit' : 'Create';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, phone, address } = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as {
      name: string;
      phone: string;
      address: string;
    };

    const data = initialValues
      ? { name, phone, address, _id: initialValues._id || '' }
      : { name, phone, address };

    try {
      const res = initialValues
        ? await updateCustomer(data).unwrap()
        : await createCustomer(data).unwrap();

      if (!res) return;

      handleAlert(res.success, res.message || `${action} successful`);

      if (res.success) {
        route.push('/dashboard/customers');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(false, error?.data?.message || error?.error || 'something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-180">
      <Card className="space-y-2 hover:bg-card!">
        <Input
          defaultValue={initialValues?.name || ''}
          name="name"
          label="Name"
          type="text"
          placeholder="Customer name"
        />
        <Input
          defaultValue={initialValues?.phone || ''}
          label="Phone"
          name="phone"
          type="tel"
          placeholder="Customer phone"
        />
        <Textarea
          label="Address"
          name="address"
          placeholder="address"
          defaultValue={initialValues?.address || ''}
        />
        <Button
          disabled={createLoading || updateLoading}
          loading={createLoading || updateLoading}
          type="submit"
          className="w-fit"
        >
          Create customer
        </Button>
      </Card>
    </form>
  );
};

export default CreateCustomerForm;
