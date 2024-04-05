"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import type { SidebarNavItem } from "@/types"
import { ChevronLeftIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import styles from "@/styles/(settings)/_components/sidebar-nav.module.scss"

export interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SidebarNavItem[]
}

export function SidebarNav({ items, className, ...props }: SidebarNavProps) {
  const segment = useSelectedLayoutSegment()

  if (!items?.length) return null

  return (
    <div className={cn(styles["sidebar-nav-layout"], className)} {...props}>
      {items.map((item, index) => {
        const Icon = item.icon ? Icons[item.icon] : ChevronLeftIcon

        return item.href ? (
          <Link
            aria-label={item.title}
            key={index}
            href={item.href}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            <span
              className={cn(
                styles["sidebar-nav-item"],
                item.href.includes(String(segment)) &&
                  styles["sidebar-nav-item-active"]
              )}
              data-disabled={item.disabled}
            >
              <Icon aria-hidden="true" />
              <span>{item.title}</span>
            </span>
          </Link>
        ) : (
          <span key={index} className={styles["sidebar-nav-item-disabled"]}>
            {item.title}
          </span>
        )
      })}
    </div>
  )
}
