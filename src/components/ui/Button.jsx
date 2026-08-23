import { cn } from '@/utils/cn'

const sizeClasses = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
}

export default function Button({ children, className, size = 'md', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-violet-800',
    outline: 'border border-primary bg-white text-primary hover:bg-primary-50',
    secondary: 'bg-white text-primary hover:bg-primary-50',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-colors',
        sizeClasses[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
