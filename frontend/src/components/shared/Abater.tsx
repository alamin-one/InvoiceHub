'use client';

import Image from 'next/image';
import clsx from 'clsx';

import namePreview from '@/lib/namePreview';
import { useGetStoreListQuery } from '@/redux/feature/storeSlice';

const Abater = ({ className }: { className?: string }) => {
  const { data, isLoading } = useGetStoreListQuery();
  const store = data?.store;

  const { color, name: avName } = namePreview(store?.name || 'IH');
  return (
    <div className={clsx('flex justify-start items-start gap-2', className)}>
      <div className=" w-10.5 h-10.5 rounded-full bg-white border border-border shrink-0">
        {store?.logo?.url ? (
          <Image
            src={store?.logo?.url || ''}
            alt={store?.name || ''}
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
        ) : (
          <div
            className={` w-10.5 h-10.5 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase ${color}`}
          >
            {avName}
          </div>
        )}
      </div>
      <div className="overflow-hidden">
        <p className="font-semibold text-title">
          {isLoading ? 'loading' : store?.name || ''}
        </p>
        <p className="p13">{isLoading ? 'loading' : store?.email || ''}</p>
      </div>
    </div>
  );
};

export default Abater;
