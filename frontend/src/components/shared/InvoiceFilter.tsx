'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Search, SlidersHorizontal } from 'lucide-react';
import Card from '../ui/card';
import Input from '../ui/input';
const filters = ['All', 'Paid', 'Partial', 'Due'];

const InvoiceFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [active, setActive] = useState(searchParams.get('status') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const setStatus = (status: string) => {
    if (status === 'All') {
      params.delete('status');
    } else {
      params.set('status', status.toLowerCase());
    }
    setActive(status);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }

      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, pathname, router]);

  return (
    <Card className="mb-5  hover:bg-card!">
      <div className="relative">
        <Search
          size={18}
          className="text-text-muted absolute top-1/2 -translate-y-1/2 right-3"
        />
        <Input
          value={search || ''}
          onChange={e => setSearch(e.target.value)}
          type="search"
          placeholder="Search invoice number or customer..."
          className="px-3 py-2 pr-10 rounded-md border"
        ></Input>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-2">
          {filters.map(f => (
            <span
              key={f}
              onClick={() => {
                setStatus(f);

                setStatus(f);
              }}
              className={`text-xs px-3.5 py-1.5 rounded-md border cursor-pointer ${
                active === f
                  ? 'bg-background-secondary  border-border'
                  : 'border-border text-text-secondary'
              }`}
            >
              {f}
            </span>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5">
          <SlidersHorizontal size={15} />
          <span className="text-xs">Filter</span>
        </button>
      </div>
    </Card>
  );
};

export default InvoiceFilter;
