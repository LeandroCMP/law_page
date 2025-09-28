import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }

export function Button({ className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={
        'inline-flex items-center justify-center font-medium rounded-md px-4 py-2 transition ' +
        'focus:outline-none focus:ring disabled:opacity-50 disabled:pointer-events-none ' +
        className
      }
    />
  )
}
