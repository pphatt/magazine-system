"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input, type InputProps } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/forms/password-input.module.scss"

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className={styles["layout"]}>
        <Input
          type={showPassword ? "text" : "password"}
          className={cn(styles["password-input"], className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={styles["icon"]}
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={props.value === ""}
        >
          {showPassword ? (
            <Icons.hide aria-hidden="true" />
          ) : (
            <Icons.view aria-hidden="true" />
          )}
          <span>{showPassword ? "Hide password" : "Show password"}</span>
        </Button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }