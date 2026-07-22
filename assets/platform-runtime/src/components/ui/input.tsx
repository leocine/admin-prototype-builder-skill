import * as React from 'react'
import { cn } from '@/utils/Utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn('flex h-9 w-full rounded-full border border-input bg-secondary px-4 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className)} ref={ref} {...props} />
))
Input.displayName = 'Input'

export { Input }
