import React from "react"
import { signOut } from "@/server/auth/auth"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/layouts/site-header.module.scss"

export function Logout() {
  return (
    <form
      className={styles["sign-out-form"]}
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <Button className={styles["sign-out"]} typeof={"submit"}>
        <span>Logout</span>
        <Icons.logout />
      </Button>
    </form>
  )
}
