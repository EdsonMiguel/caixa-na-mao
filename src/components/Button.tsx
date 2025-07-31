import { forwardRef, ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', ...rest }, ref) => {
    const base =
      'px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants = {
      primary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500',
      secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300',
    };

    return <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...rest} />;
  },
);

Button.displayName = 'Button';
