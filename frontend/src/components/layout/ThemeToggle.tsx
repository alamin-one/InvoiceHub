'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-fit p-2 md:p-1 border border-border rounded-md  ">
        <Sun size={22} />
      </div>
    );
  }

  return (
    <button
      className="p-2 md:p-1  border border-border rounded-md cursor-pointer"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
};

export default ThemeToggle;
