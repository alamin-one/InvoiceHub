'use client';

import { ReactNode, useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

const DashboardShell = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(prev => !prev)}
      />
      <div className="flex-1 flex flex-col overflow-y-scroll scrollbar-none">
        <DashboardHeader
          onToggle={() => setIsMenuOpen(prev => !prev)}
          isOpen={isMenuOpen}
        />
        <main className=" "> {children}</main>
      </div>
    </div>
  );
};

export default DashboardShell;
