import * as React from "react"
import Link from "next/link"
import { db } from "@/server/db"
import type { User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import type { ContributionWithUser } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { BlogCard } from "@/components/blog-card"
import { FacultyCarousel } from "@/components/carousel/faculty-carousel"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shells/shell"
import styles from "@/styles/(lobby)/page.module.scss"

export default async function LobbyPage() {
  const user = (await currentUser()) as User

  const faculty = await db.faculty.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          contributions: true,
        },
      },
    },
  })

  let contributions: ContributionWithUser[]

  if (user?.role === "GUEST") {
    contributions = (await db.contributions.findMany({
      where: {
        status: "APPROVE",
        allowGuest: true,
      },
      take: 12,
      orderBy: {
        gradedAt: "desc",
      },
      include: {
        author: true,
      },
    })) as ContributionWithUser[]
  } else if (user?.role === "MARKETING_COORDINATOR") {
    contributions = (await db.contributions.findMany({
      where: {
        facultyId: user.facultyId ?? "",
        status: "APPROVE",
      },
      take: 12,
      orderBy: {
        gradedAt: "desc",
      },
      include: {
        author: true,
      },
    })) as ContributionWithUser[]
  } else {
    contributions = (await db.contributions.findMany({
      where: {
        allowGuest: true,
        status: "APPROVE",
      },
      take: 12,
      orderBy: {
        gradedAt: "desc",
      },
      include: {
        author: true,
      },
    })) as ContributionWithUser[]
  }

  return (
    <Shell as={"div"} className={styles["shell"]}>
      <div className={styles["home-banner-wrapper"]}>
        <div className={styles["banner-text"]}>
          <h2>Welcome to Magazine University System</h2>
        </div>
        <div className={styles["banner-image"]}>
          <img src={"/banner.png"} alt={""} />
        </div>
      </div>

      <div className={styles["faculty-carousel"]}>
        <div className={styles["faculty-carousel-header"]}>Faculties</div>
        <FacultyCarousel faculty={faculty} />
      </div>

      <div className={styles["blog-card"]}>
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
        <BlogCard contributions={contributions} />
      </div>
    </Shell>
  )
}
