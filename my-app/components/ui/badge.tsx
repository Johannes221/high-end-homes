import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#c9a45c] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#c9a45c] text-[#0a0a0a] hover:bg-[#d4af37]",
        secondary:
          "border-transparent bg-[#2a2a2a] text-[#fafafa] hover:bg-[#3a3a3a]",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-[#fafafa] border-[#2a2a2a]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
