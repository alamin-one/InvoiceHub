import CustomerDetails from '@/components/shared/CustomerDetails';
import SectionBar from '@/components/shared/SectionBar';

const page = async () => {
  
  return (
    <section className="app-container">
      <SectionBar
        title="Customer Details"
        description="A quick snapshot of my customer."
      />
      <CustomerDetails />
    </section>
  );
};

export default page;
