'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Search } from 'lucide-react';
import Card from '../ui/card';
import Input from '../ui/input';

const CustomerFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [search, setSearch] = useState(searchParams.get('search') || '');

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
          placeholder="Search customer name or phone..."
          className="px-3 py-2 pr-10 rounded-md border"
        ></Input>
      </div>
    </Card>
  );
};

export default CustomerFilter;
