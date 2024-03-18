import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import styles from "@/styles/components/ui/button.module.scss"

const buttonVariants = cva(styles["btn"], {
  variants: {
    variant: {
      default: styles["default-variant"],
      destructive: styles["destructive-variant"],
      outline: styles["outline-variant"],
      secondary: styles["secondary-variant"],
      ghost: styles["ghost-variant"],
      link: styles["link-variant"],
      custom: "",
    },
    size: {
      default: styles["default-size"],
      sm: styles["sm-size"],
      lg: styles["lg-size"],
      icon: styles["icon"],
      custom: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
