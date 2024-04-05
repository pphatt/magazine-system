"use client"

import * as React from "react"
import Link from "next/link"
import { type User } from "next-auth"

import { logout } from "@/lib/actions/logout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/layouts/admin-site-header.module.scss"

interface AdminSiteHeaderProps {
  user: User | null
}

export function AdminSiteHeader({ user }: AdminSiteHeaderProps) {
  return (
    <div className={styles["site-header-wrapper"]}>
      <div className={styles["site-header-container"]}>
        <div className={styles["site-header-logo"]}>
          <Link href={"/"}>
            <img src={"/logo_final.png"} alt={""} className={styles["logo"]} />
          </Link>
        </div>
        <div className={styles["site-header-option"]}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className={styles["avatar-trigger"]}>
                {user ? (
                  <Avatar className={styles["avatar"]}>
                    <AvatarImage
                      src={user?.image as string | undefined}
                      alt={""}
                      style={{
                        objectFit: "cover",
                        objectPosition: "top",
                      }}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0) ?? ""}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Icons.user />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={"end"}
              className={styles["dropdown-menu"]}
            >
              {user ? (
                <>
                  <DropdownMenuLabel className={styles["dropdown-label"]}>
                    <div>
                      <p>{user.name}</p>
                      <p>{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator
                    className={styles["dropdown-separate-line"]}
                  />
                  <DropdownMenuItem className={styles["dropdown-item"]}>
                    <Link
                      className={styles["dropdown-item-link"]}
                      href={"/settings/profile"}
                    >
                      <span>Account</span>
                      <Icons.circleUserRound />
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className={styles["dropdown-item"]}>
                  <Link
                    className={styles["dropdown-item-link"]}
                    href={"/signin"}
                  >
                    <span>Sign In</span>
                    <Icons.login />
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem className={styles["dropdown-item"]}>
                <Link
                  className={styles["dropdown-item-link"]}
                  href={"/settings/all"}
                >
                  <span>Settings</span>
                  <Icons.settings />
                </Link>
              </DropdownMenuItem>

              {user && (
                <>
                  <DropdownMenuSeparator
                    className={styles["dropdown-separate-line"]}
                  />
                  <DropdownMenuItem className={styles["dropdown-item"]}>
                    <span
                      className={styles["sign-out"]}
                      onClick={() => logout()}
                    >
                      <span>Logout</span>
                      <Icons.logout />
                    </span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
