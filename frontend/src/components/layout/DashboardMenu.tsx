'use client';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';

import Button from '../ui/button';
import {
  FilesIcon,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import { useSignOutMutation } from '@/redux/feature/storeSlice';
import handleAlert from '@/lib/handleAlert';

export const AdminMenu1 = [
  { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  {
    name: 'Customers',
    icon: Users,
    href: '/dashboard/customers',
  },
  {
    name: 'Create Customer',
    icon: Plus,
    href: '/dashboard/customers/add',
  },
  {
    name: 'Invoices',
    icon: FilesIcon,
    href: '/dashboard/invoices',
  },
  {
    name: 'Create Invoice',
    icon: Plus,
    href: '/dashboard/invoices/add',
  },
];
export const AdminMenu2 = [
  {
    name: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

const DashboardMenu = () => {
  const pathname = usePathname();
  const route = useRouter();
  const [signOut, { isLoading }] = useSignOutMutation();

  const onSignOut = async () => {
    try {
      const res = await signOut({}).unwrap();
      if (!res) return;
      if (res.success) {
        Cookies.remove('clientToken', {
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        handleAlert(res.success, res.message || 'Logout successful');
        route.push('/signin');
        route.refresh();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAlert(false, error.data.message || error.message);
    }
  };

  return (
    <>
      <div className="space-y-2 mt-5 border-b border-b-border pb-5">
        {AdminMenu1.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              //  onClick={onToggle}
              href={item.href}
              key={index}
              className={clsx(
                'py-2 px-3 rounded-xl flex justify-start items-center gap-2 p13 text-title',
                pathname === item.href
                  ? 'bg-title-secondary/10 text-title-secondary font-medium  '
                  : 'hover:bg-card hover:text-title ',
              )}
            >
              <Icon size={15} />
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="mt-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {AdminMenu2.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                // onClick={onToggle}
                href={item.href}
                key={index}
                className={clsx(
                  'py-2 px-3 rounded-xl flex justify-start items-center gap-2 p13 text-title',
                  pathname === item.href
                    ? 'bg-title-secondary/10 text-title-secondary font-medium  '
                    : 'hover:bg-card hover:text-title ',
                )}
              >
                <Icon size={15} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      <Button
        onClick={onSignOut}
        disabled={isLoading}
        loading={isLoading}
        type="button"
        className="w-full border-none px-3! py-2! mt-8 justify-start"
        variant="secondary"
      >
        <LogOut size={15} />
        Logout
      </Button>
    </>
  );
};

export default DashboardMenu;
