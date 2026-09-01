import SectionBar from '@/components/shared/SectionBar';
import SettingsClient from './SettingsClient';

const SettingsPage = async () => {
  return (
    <div className="app-container">
      <SectionBar
        title="Settings"
        description="A quick snapshot of my settings."
      />
      <SettingsClient />
    </div>
  );
};

export default SettingsPage;
