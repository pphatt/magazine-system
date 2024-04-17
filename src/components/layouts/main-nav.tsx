"use client"

import React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import styles from "@/styles/components/layouts/main-nav.module.scss"

export const MainNav = () => {
  return (
    <div className={styles["main-nav-layout"]}>
      <nav className={styles["main-nav"]}>
        <Link className={styles["name"]} href={"/"}>
          <img src={"/logo_final-1.jpg"} alt={""} />
          <span>Magazine University System</span>
        </Link>
      </nav>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={String(href)}
          className={cn(styles["list-item"], className)}
          {...props}
        >
          <div>{title}</div>
          <p>{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
