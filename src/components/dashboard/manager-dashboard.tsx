import * as React from "react"
import { db } from "@/server/db"

import {
  getContributionPercentageData,
  getData,
} from "@/lib/fetchers/dashboard"
import { BlogStatusPercentageChart } from "@/components/dashboard/marketing-manager/blog-status-percentage"
import { ManageChart } from "@/components/dashboard/marketing-manager/chart"
import { ContributionPercentageChart } from "@/components/dashboard/marketing-manager/contribution-percentage-chart"
import { FacultyContributionsPercentageChart } from "@/components/dashboard/marketing-manager/faculty-contributions-percentage"
import { TotalContributorsChart } from "@/components/dashboard/marketing-manager/total-contributors"
import styles from "@/styles/components/dashboard/manager-dashboard.module.scss"

export async function ManagerDashboard() {
  const data = await getData()

  const blogsWithAcademicYear = await getContributionPercentageData()

  const contributions = await db.contributions.findMany({
    include: {
      faculty: true,
      academicYear: true,
    },
  })

  const faculties = await db.faculty.findMany()
  const academicYears = await db.academicYear.findMany({
    orderBy: [
      {
        createdAt: "asc",
      },
    ],
  })

  const approve_contributions = contributions.filter(
    (contribution) => contribution.status === "APPROVE"
  )
  const reject_contributions = contributions.filter(
    (contribution) => contribution.status === "REJECT"
  )

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
        <ManageChart data={data} />
      </div>
      <div className={styles["chart"]}>
        <ContributionPercentageChart
          contributions={blogsWithAcademicYear}
          faculty={faculties}
          academicYear={academicYears}
        />
      </div>
      <div className={styles["chart"]} style={{ display: "flex" }}>
        <BlogStatusPercentageChart
          contributions={contributions}
          faculties={faculties}
          academicYears={academicYears}
        />
        <FacultyContributionsPercentageChart
          contributions={blogsWithAcademicYear}
          faculty={faculties}
          academicYears={academicYears}
        />
      </div>
      <div className={styles["chart"]}>
        <TotalContributorsChart
          contributors={blogsWithAcademicYear}
          faculty={faculties}
          academicYear={academicYears}
        />
      </div>
    </div>
  )
}
