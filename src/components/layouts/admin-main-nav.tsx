"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { ChevronLeftIcon } from "lucide-react"

import { adminSiteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import styles from "@/styles/components/layouts/admin-main-nav.module.scss"

import { Icons } from "../icons"

export function AdminMainNav() {
  const segment = useSelectedLayoutSegment()

  const items = adminSiteConfig.mainNav

  if (!items?.length) return null

  return (
    <div className={styles["admin-main-nav-wrapper"]}>
      <div className={styles["admin-main-nav-container"]}>
        <nav className={styles["nav"]}>
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
                    styles["nav-item"],
                    item.href.includes(
                      segment
                        ? String(segment)
                        : item.href === "/admin" && "/admin"
                    ) && styles["nav-item-active"]
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
        </nav>
      </div>
    </div>
  )
}
