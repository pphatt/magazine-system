import * as React from "react"

import { Shell } from "@/components/shells/shell"
import styles from "@/styles/(lobby)/page.module.scss"
import { CarouselSize } from "@/app/(lobby)/_components/carousel"
import { Faculty } from "@/app/(lobby)/_components/faculty"
import { RecentBlog } from "@/app/(lobby)/_components/recent-blog"

// const faculties = [
//   { faculty: "IT & Software", description: "100 Workspace", href: "/" },
//   { faculty: "Photography", description: "100 Workspace", href: '/' },
//   { faculty: "Marketing", description: "100 Workspace", href: "/" },
// ]

export default function Page() {
  return (
    <Shell as={"div"} className={styles["shell"]}>
      <CarouselSize />
      <Faculty />
      <RecentBlog />
    </Shell>
  )
}
