import * as React from "react"
import { db } from "@/server/db"
import type { SearchParams } from "@/types"

import {
  getAcceptAndRejectInFaculty,
  getPieChartData,
} from "@/lib/fetchers/dashboard"
import { dashboardParamsSchema } from "@/lib/validations/dashboard"
import { AcademicYearChart } from "@/components/dashboard/academic-year-chart"
import { PieChart } from "@/components/dashboard/pie-chart"
import { SelectAcademicYear } from "@/components/select-academic-year"
import styles from "@/styles/(admin)/page.module.scss"

interface AdminPageProps {
  searchParams: SearchParams
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { academicYearId } = dashboardParamsSchema.parse(searchParams)

  const academicYears = await db.academicYear.findMany()

  const AcademicYearChartData = await getAcceptAndRejectInFaculty({
    academicYearId,
  })

  const pieChartData = await getPieChartData({ academicYearId })

  return (
    <div className={styles["dashboard-wrapper"]}>
      <div className={styles["dashboard-container"]}>
        <SelectAcademicYear academicYears={academicYears} />
        <div className={styles["dashboard"]}>
          <AcademicYearChart data={AcademicYearChartData} />
        </div>
        <div className={styles["dashboard"]}>
          <PieChart data={pieChartData} />
        </div>
      </div>
    </div>
  )
}
