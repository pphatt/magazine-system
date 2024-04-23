"use client"

import * as React from "react"
import type { AcademicYear, Faculty } from "@prisma/client"
import type { ChartData, ChartOptions } from "chart.js"
import { Pie } from "react-chartjs-2"

import type { ContributionsWithAcademicYear } from "@/lib/prisma"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import styles from "@/styles/components/dashboard/faculty-contributions-percentage.module.scss"

const options: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        label: (value) => {
          const parserValue = value as { raw: string; label: string }
          const percentage = `${parserValue.label}: ${parserValue.raw}%`
          return percentage
        },
      },
    },
  },
}

interface FacultyContributionsPercentageChartProps {
  contributions: ContributionsWithAcademicYear[]
  faculty: Faculty[]
  academicYears: AcademicYear[]
}

export function FacultyContributionsPercentageChart({
  contributions,
  faculty,
  academicYears,
}: FacultyContributionsPercentageChartProps) {
  const [selectAcademicYear, setSelectAcademicYear] = React.useState(
    academicYears[0]?.id ?? ""
  )

  const getTheSameAcademicYearContributions = contributions.find(
    ({ id }) => id === selectAcademicYear
  )!

  const data: ChartData<"pie"> = {
    labels: faculty.map(({ name }) => name),
    datasets: [
      {
        label: "Percentage of total blog count",
        data: faculty.map(({ id }) => {
          let total = 0

          total += getTheSameAcademicYearContributions.contributions.filter(
            ({ facultyId }) => facultyId === id
          ).length

          const totalBlogsInYear =
            getTheSameAcademicYearContributions.contributions.length

          const percentageData = Math.round((total / totalBlogsInYear) * 100)

          return percentageData
        }),
        borderWidth: 1,
        backgroundColor: [
          "rgba(118,189,105, 0.5)",
          "rgba(16,22,223, 0.5)",
          "rgba(148,169,233, 0.5)",
          "rgba(233,197,40, 0.5)",
          "rgba(133,250,146, 0.5)",
          "rgba(208,95,242, 0.5)",
        ],
        borderColor: [
          "rgba(118,189,105, 1)",
          "rgba(16,22,223, 1)",
          "rgba(148,169,233, 1)",
          "rgba(233,197,40, 1)",
          "rgba(133,250,146, 1)",
          "rgba(208,95,242, 1)",
        ],
      },
    ],
  }

  return (
    <div className={styles["wrapper"]}>
      <h2 className={styles["text"]}>Total Faculty Contributions Percentage</h2>

      <div className={styles["filter-wrapper"]}>
        <Select
          value={selectAcademicYear}
          onValueChange={setSelectAcademicYear}
        >
          <SelectTrigger className={styles["select"]}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {academicYears.map(({ id, name }) => (
              <SelectItem value={id}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={styles["chart-wrapper"]}>
        <Pie className={styles["chart"]} options={options} data={data} />
      </div>
    </div>
  )
}
