'use client';

import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  variant?: 'dark' | 'darker';
  wrapperClassName?: string;
}

export function Input({
  label,
  variant = 'dark',
  id,
  wrapperClassName = '',
  className = '',
  ...props
}: Props) {
  const bg = variant === 'dark' ? 'bg-gray-900' : 'bg-black';
  const fieldId = id ?? `field-${label.toLowerCase().replace(/[\s/]+/g, '-')}`;

  return (
    <div className={wrapperClassName}>
      <label htmlFor={fieldId} className="sr-only">
        {label}
      </label>
      <input
        id={fieldId}
        className={`w-full ${bg} border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition placeholder-gray-600 ${className}`.trim()}
        {...props}
      />
    </div>
  );
}
