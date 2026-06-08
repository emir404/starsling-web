import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-4",
  {
    variants: {
      variant: {
        // Soft pill, e.g. "Backed by Y Combinator"
        default:
          "border-border bg-card text-foreground shadow-[0_1px_12px_rgba(4,21,10,0.1)] [a]:hover:bg-secondary",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a]:hover:bg-muted",
        outline: "border-border bg-transparent text-foreground [a]:hover:bg-secondary",
        brand: "border-transparent bg-primary text-primary-foreground",
        // Square mono tag, e.g. "[C] CUSTOMERS", "8 JOBS IN PARALLEL"
        mono: "rounded-none border-transparent bg-field px-2.5 py-1 font-mono text-xs uppercase tracking-[0.02em] text-foreground/70 [&>svg]:size-3.5",
        destructive:
          "border-transparent bg-destructive/10 text-destructive [a]:hover:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
