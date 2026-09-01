import clsx from 'clsx';
import Abater from '../shared/Abater';
import DashboardMenu from './DashboardMenu';

const DashboardSidebar = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <>
      <aside
        onClick={onToggle}
        className={clsx(
          'bg-transparent fixed md:static md:flex flex-col top-0 left-0 ',
          'w-full h-full max-w-full md:max-w-65 min-h-full transition-all duration-200 z-50   ',
          isOpen ? '' : 'transform -translate-x-full md:translate-x-0',
        )}
      >
        <div className=" w-2/3 md:w-full h-full p-5 bg-background-secondary ">
          <div className="space-y-0 border-b border-b-border pb-4">
            <Abater />
          </div>
          <DashboardMenu />
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
