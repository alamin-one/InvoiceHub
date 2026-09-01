'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ThemeProviders = ({ children }: Props) => {
  return (
    <ThemeProvider
      attribute={'class'}
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default ThemeProviders;
