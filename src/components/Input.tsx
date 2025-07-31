import { forwardRef, ComponentProps } from 'react';

export const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  ({ className = '', ...rest }, ref) => (
    <input
      ref={ref}
      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
      {...rest}
    />
  ),
);

Input.displayName = 'Input';
