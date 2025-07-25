import { forwardRef, ComponentProps } from 'react';

interface TextFieldProps extends ComponentProps<'input'> {
  label?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({ label, ...rest }, ref) => {
  return (
    <>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        ref={ref}
        {...rest}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />
    </>
  );
});

TextField.displayName = 'TextField';
