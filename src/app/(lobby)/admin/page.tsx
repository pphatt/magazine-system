import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import styles from "@/styles/(lobby)/admin/page.module.scss"

export default function AdminPage() {
  return (
    <div className={styles["layout"]}>
      <div>
        <Button variant={"outline"} asChild>
          <Link href={"/admin/create"}>Create Workspace</Link>
        </Button>
      </div>
      <div></div>
    </div>
  )
}
