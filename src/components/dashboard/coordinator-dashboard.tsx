import * as React from "react"
import { db } from "@/server/db"
import type { User } from "next-auth"

import { TopContributorsChart } from "@/components/dashboard/marketing-coordinator/top-contributors"
import styles from "@/styles/components/dashboard/coordinator-dashboard.module.scss"

interface CoordinatorDashboardProps {
  user: User
}

export async function CoordinatorDashboard({
  user,
}: CoordinatorDashboardProps) {
  const academicYears = await db.academicYear.findMany({
    orderBy: [
      {
        createdAt: "asc",
      },
    ],
  })

  const contributions = await db.contributions.findMany({
    where: {
      facultyId: user.facultyId!,
    },
    include: {
      faculty: true,
      academicYear: true,
    },
  })

  const approve_contributions = contributions.filter(
    (contribution) => contribution.status === "APPROVE"
  )
  const reject_contributions = contributions.filter(
    (contribution) => contribution.status === "REJECT"
  )

  const topContributors = await db.user.findMany({
    where: {
      role: "STUDENT",
      facultyId: user.facultyId!,
    },
    include: {
      authorContributions: true,
    },
    orderBy: {
      authorContributions: {
        _count: "desc",
      },
    },
    take: 10,
  })

  return (
    <div className={styles["manage-page-wrapper"]}>
      <div className={styles["text"]}>
        <h1>Statistic analysis</h1>
      </div>
      <div className={styles["manage-card"]}>
        <div className={styles["card-wrapper"]}>
          <div className={styles["card-container"]}>
            <h4>Total contributions</h4>
            <div className={styles["count"]}>{contributions.length}</div>
          </div>
        </div>
        <div className={styles["card-wrapper"]}>
          <div className={styles["card-container"]}>
            <h4>Total accept contributions</h4>
            <div className={styles["count"]}>
              {approve_contributions.length}
            </div>
          </div>
        </div>
        <div className={styles["card-wrapper"]}>
          <div className={styles["card-container"]}>
            <h4>Total reject contributions</h4>
            <div className={styles["count"]}>{reject_contributions.length}</div>
          </div>
        </div>
      </div>
      <div className={styles["chart"]}>
        <TopContributorsChart
          contributors={topContributors}
          academicYears={academicYears}
        />
      </div>
    </div>
  )
}
