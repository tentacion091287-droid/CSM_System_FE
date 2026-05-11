import { forwardRef } from 'react'

const Select = forwardRef(({ className = '', children, ...props }, ref) => (
  <div className={`relative ${className}`}>
    <select ref={ref} {...props} className="select-exotic">
      {children}
    </select>
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
      fill="none" viewBox="0 0 24 24" stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
))

Select.displayName = 'Select'
export default Select
