"use client";

import React from "react";
import Link from "next/link";
import type { MainNavItem } from "@/types";



import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import styles from "@/styles/components/layouts/main-nav.module.scss";





interface MainNavProps {
  items: MainNavItem[]
}

export const MainNav = ({ items }: MainNavProps) => {
  return (
    <div className={styles["main-nav-layout"]}>
      <nav className={styles["main-nav"]}>
        <Link className={styles["name"]} href={"/"}>
          <img src={"/logo_final.png"} alt={""} />
        </Link>
      </nav>
      <NavigationMenu>
        <NavigationMenuList>
          {items.map(
            (item) =>
              item.href && (
                <NavigationMenuItem key={item.title}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      style={{ height: "auto" }}
                      className={cn(navigationMenuTriggerStyle)}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
          )}
        </NavigationMenuList>
      </NavigationMenu>
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
