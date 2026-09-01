import DashboardOverview from '@/components/shared/DashboardOverview';
import SectionBar from '@/components/shared/SectionBar';

const DashboardPage = async () => {
  return (
    <section className="app-container">
      <SectionBar
        title="Overview"
        description="A quick snapshot of my invoices."
      />
      <DashboardOverview />
    </section>
  );
};

export default DashboardPage;
