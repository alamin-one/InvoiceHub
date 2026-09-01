import CreateCustomerForm from '@/components/shared/CreateCustomerForm';
import SectionBar from '@/components/shared/SectionBar';

const page = () => {
  return (
    <section className="app-container">
      <SectionBar
        title="Create customer"
        description="Create a new customer."
      />

      <CreateCustomerForm initialValues={null} />
    </section>
  );
};

export default page;
