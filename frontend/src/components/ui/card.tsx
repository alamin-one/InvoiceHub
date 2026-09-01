import { ReactNode } from 'react';
import clsx from 'clsx';

const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div
        className={clsx(
          'bg-card hover:bg-card-hover  p-5 border border-border   rounded-xl transition-colors',
          className,
        )}
      >
        {children}
      </div>
    </>
  );
};

export default Card;
