import SectionBar from '@/components/shared/SectionBar';
import PageClient from './PageClient';

const page = async () => {
  
  return (
    <section className="max-w-300 mx-auto p-5">
      <SectionBar title="Create invoice" description="Create a new invoice." />
      <PageClient />
    </section>
  );
};

export default page;
