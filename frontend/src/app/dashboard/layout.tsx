import { ReactNode } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
