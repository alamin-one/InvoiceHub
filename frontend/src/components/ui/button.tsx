import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface VariantClass {
  primary: string;
  secondary: string;
}
interface SizeClass {
  md: string;
  sm: string;
}
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;

  size?: keyof SizeClass;
  variant?: keyof VariantClass;
  disabled?: boolean;
  loading?: boolean;
}

const Button = ({
  children,
  className,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ...props
}: Props) => {
  const variantClass: VariantClass = {
    primary: 'bg-button text-button-text  hover:bg-button-hover',
    secondary:
      'bg-transparent border border-border text-title hover:border-title-secondary/50',
  };

  const sizeClass: SizeClass = {
    md: 'px-5 py-2 text-[14px]',
    sm: 'px-4 py-1.5 text-[12px]',
  };

  const selectedVariant = variantClass[variant];
  const selectSize = sizeClass[size];
  return (
    <>
      <button
        className={clsx(
          'flex items-center justify-center gap-2 tracking-wide font-normal font-secondary  uppercase  rounded-md',
          'active:scale-90 disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-300',
          selectSize,
          selectedVariant,
          className,
          loading ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
        disabled={disabled || loading}
        {...props}
        type={type}
      >
        {loading && (
          <div className="w-4 h-4 border border-t-2 border-neo-black/20 border-t-neo-black rounded-full animate-spin"></div>
        )}

        {loading ? 'Loading...' : children}
      </button>
    </>
  );
};
export default Button;
