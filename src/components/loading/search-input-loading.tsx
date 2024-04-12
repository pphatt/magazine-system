import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import styles from "@/styles/components/loading/search-input-loading.module.scss"

export function SearchInputLoading() {
  return (
    <div className={styles["search-input-loading"]}>
      <Skeleton />
    </div>
  )
}
