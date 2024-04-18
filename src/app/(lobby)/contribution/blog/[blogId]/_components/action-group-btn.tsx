"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import styles from "@/styles/(lobby)/contribution/blog/_components/action-group-btn.module.scss"

export function ActionGroupButton() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={styles["like-btn"]}>
            <Icons.ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side={"right"} align={"start"}>
          <DropdownMenuItem onSelect={(event: Event) => event.preventDefault()}>
            Copy blog url
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
