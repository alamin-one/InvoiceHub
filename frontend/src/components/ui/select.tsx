import { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  label?: string;
  placeholder?: string;
}

const Select = ({ className, label, ...props }: Props) => {
  return (
    <div className="w-full">
      {label && (
        <label className="p13 mb-2 block font-normal capitalize">{label}</label>
      )}

      <select
        className={clsx(
          'w-full border border-border rounded-md px-4 py-1.5 ',
          'outline-none focus:ring-1 ring-title-secondary disabled:opacity-60',
          'disabled:cursor-not-allowed',

          className,
        )}
        {...props}
      />
    </div>
  );
};

export default Select;
