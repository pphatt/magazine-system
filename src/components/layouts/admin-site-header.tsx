import * as React from "react"
import Link from "next/link"
import { type User } from "next-auth"

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
import { MainNav } from "@/components/layouts/main-nav"
import { ThemeToggle } from "@/components/layouts/theme-toggle"
import { LogOut } from "@/components/logout"
import styles from "@/styles/components/layouts/admin-site-header.module.scss"

interface AdminSiteHeaderProps {
  user: User | null
}

export function AdminSiteHeader({ user }: AdminSiteHeaderProps) {
  return (
    <header className={styles["site-header-wrapper"]}>
      <div className={styles["site-header-container"]}>
        <MainNav />
        <div className={styles["outer-nav-action"]}>
          <nav className={styles["nav-action"]}>
            <Button variant="outline" className={styles["search"]} asChild>
              <Link href={"/contribution?page=1&row=10"}>
                <Icons.layers aria-hidden="true" />
                <span className={styles["search-span-metadata"]}>
                  Contributions
                </span>
                <span className={styles["search-span"]}>Contribution</span>
              </Link>
            </Button>
          </nav>
        </div>
        <div className={styles["site-header-option"]}>
          <ThemeToggle />
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
                      href={"/account/profile"}
                    >
                      <span>Account</span>
                      <Icons.settings />
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "STUDENT" && (
                    <DropdownMenuItem className={styles["dropdown-item"]}>
                      <Link
                        className={styles["dropdown-item-link"]}
                        href={"/account/recent-blogs?page=1&row=10"}
                      >
                        <span>Recent Blogs</span>
                        <Icons.layers />
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator
                        className={styles["dropdown-separate-line"]}
                      />
                      <DropdownMenuItem className={styles["dropdown-item"]}>
                        <Link
                          className={styles["dropdown-item-link"]}
                          href={"/admin"}
                        >
                          <span>Admin</span>
                          <Icons.circleUserRound />
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === "MARKETING_COORDINATOR" && (
                    <>
                      <DropdownMenuSeparator
                        className={styles["dropdown-separate-line"]}
                      />
                      <DropdownMenuItem className={styles["dropdown-item"]}>
                        <Link
                          className={styles["dropdown-item-link"]}
                          href={"/contribution/manage"}
                        >
                          <span>Manage contribution</span>
                          <Icons.building />
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === "MARKETING_MANAGER" && (
                    <>
                      <DropdownMenuSeparator
                        className={styles["dropdown-separate-line"]}
                      />
                      <DropdownMenuItem className={styles["dropdown-item"]}>
                        <Link
                          className={styles["dropdown-item-link"]}
                          href={"/contribution/manage"}
                        >
                          <span>Manage faculty</span>
                          <Icons.building />
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator
                    className={styles["dropdown-separate-line"]}
                  />
                  <DropdownMenuItem className={styles["dropdown-item"]}>
                    <Link
                      className={styles["dropdown-item-link"]}
                      href={"/account/like-blogs?page=1&row=10"}
                    >
                      <span>Like blogs</span>
                      <Icons.heart />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className={styles["dropdown-item"]}>
                    <Link
                      className={styles["dropdown-item-link"]}
                      href={"/account/save-blogs?page=1&row=10"}
                    >
                      <span>Save blogs</span>
                      <Icons.bookmark />
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

              {user && (
                <>
                  <DropdownMenuSeparator
                    className={styles["dropdown-separate-line"]}
                  />
                  <DropdownMenuItem className={styles["dropdown-item"]}>
                    <LogOut />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
