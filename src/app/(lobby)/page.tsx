import * as React from "react"
import Link from "next/link"
import { db } from "@/server/db"

import type { BlogWithUser } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { BlogCard } from "@/components/blog-card"
import { FacultyCarousel } from "@/components/carousel/faculty-carousel"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shells/shell"
import styles from "@/styles/(lobby)/page.module.scss"

export default async function LobbyPage() {
  const faculty = await db.faculty.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          blogs: true,
        },
      },
    },
  })

  const blogs = (await db.blogs.findMany({
    take: 12,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  })) as BlogWithUser[]

  return (
    <Shell as={"div"} className={styles["shell"]}>
      <div className={styles["faculty-carousel"]}>
        <div className={styles["faculty-carousel-header"]}>Faculties</div>
        <FacultyCarousel faculty={faculty} />
      </div>

      <div>
        <div className={styles["blog-card-header-wrapper"]}>
          <div className={styles["blog-card-header"]}>
            <h2>Recent blogs</h2>
            <p>Latest blog would be here</p>
          </div>
          <Button variant="outline" className={styles["search"]} asChild>
            <Link href={"/contribution"}>
              <Icons.layers aria-hidden="true" />
              <span className={styles["search-span-metadata"]}>
                Contributions
              </span>
              <span className={styles["search-span"]}>Contribution</span>
            </Link>
          </Button>
        </div>
        <BlogCard blogs={blogs} />
      </div>
    </Shell>
  )
}
