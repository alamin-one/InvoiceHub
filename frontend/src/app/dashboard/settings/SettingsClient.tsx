'use client';

import { useState } from 'react';
import store from '@/types/store';

import StoreProfile from '@/components/setting/StoreProfile';
import StorePreferences from '@/components/setting/StorePreferences';
import StoreSettings from '@/components/setting/StoreSettings';
import StorePassword from '@/components/setting/StorePassword';
import { useGetStoreListQuery } from '@/redux/feature/storeSlice';
import StoreDeleteAccount from '@/components/setting/StoreDeleteAccount';
import Card from '@/components/ui/card';

import {
  FileSliders,
  RectangleEllipsis,
  SlidersHorizontal,
  Store,
  Trash2,
} from 'lucide-react';
import Loading from '@/components/shared/Loading';

const MENU_ITEMS = [
  { id: 'profile', label: 'profile', icon: Store },
  { id: 'settings', label: 'Invoice Settings', icon: FileSliders },
  { id: 'password', label: 'Password', icon: RectangleEllipsis },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: SlidersHorizontal,
  },
  {
    id: 'delete-account',
    label: 'Delete Account',
    icon: Trash2,
  },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { data, isLoading } = useGetStoreListQuery();
  const store = data?.store;

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      <Card className="w-full lg:w-75 hover:bg-card!">
        {MENU_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1 text-left p13 ${
                activeTab === item.id
                  ? 'bg-title-secondary/10  text-title-secondary font-medium'
                  : 'text-text hover:bg-background'
              }`}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </Card>
      {/* Content */}
      <Card className="w-full hover:bg-card!">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {activeTab === 'profile' && <StoreProfile store={store as store} />}
            {activeTab === 'settings' && (
              <StoreSettings store={store as store} />
            )}
            {activeTab === 'password' && <StorePassword />}
            {activeTab === 'preferences' && <StorePreferences />}
            {activeTab === 'delete-account' && <StoreDeleteAccount />}
          </>
        )}
      </Card>
    </div>
  );
};

export default SettingsPage;
