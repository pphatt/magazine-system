import * as React from "react"

import { Shell } from "@/components/shells/shell"
import styles from "@/styles/(lobby)/page.module.scss"
import { CarouselSize } from "@/app/(lobby)/_components/carousel"
import { Faculty } from "@/app/(lobby)/_components/faculty"
import { Footer } from "@/app/(lobby)/_components/footer"
import { RecentBlog } from "@/app/(lobby)/_components/recent-blog"

export default function Page() {
  return (
    <Shell as={"div"} className={styles["shell"]}>
      <CarouselSize />
      <Faculty />
      <RecentBlog />
      <Footer />
    </Shell>
  )
}
