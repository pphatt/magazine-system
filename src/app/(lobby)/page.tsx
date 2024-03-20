import * as React from "react"

import { Shell } from "@/components/shells/shell"
import styles from "@/styles/(lobby)/page.module.scss"
import { CarouselSize } from "@/app/(lobby)/_components/carousel"
import { Faculty } from "@/app/(lobby)/_components/faculty"
import { RecentBlog } from "@/app/(lobby)/_components/recent-blog"

export default function Page() {
  return (
    <Shell as={"div"} className={styles["shell"]}>
      <CarouselSize />
      <Faculty />
      <RecentBlog />
      <div className={styles["images-wrapper"]}>
        <div>
          <img src={"images/image_1.jpg"} alt={""} />
        </div>
        <div>
          <img src={"images/image_2.jpg"} alt={""} />
        </div>
        <div>
          <img src={"images/image_3.jpg"} alt={""} />
        </div>
        <div>
          <img src={"images/image_4.jpg"} alt={""} />
        </div>
      </div>
    </Shell>
  )
}
