"use client"

import React from "react"
import type { AcademicYear, Prisma } from "@prisma/client"
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartData,
} from "chart.js"
import { Bar } from "react-chartjs-2"

import { getRandomColor } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import styles from "@/styles/components/dashboard/marketing-coordinator/top-contrbutors.module.scss"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
    tooltip: {
      callbacks: {
        label: (value: { label: string; formattedValue: string }) => {
          const percentage = `${value.label}: ${value.formattedValue} contributions`
          return percentage
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Total approve blogs of students",
      },
      max: 100,
    },
    y: {
      title: {
        display: true,
        text: "Contributors",
      },
    },
  },
}

interface TopContributorsChartProps {
  contributors: Prisma.UserGetPayload<{
    include: { authorContributions: true }
  }>[]
  academicYears: AcademicYear[]
}

export function TopContributorsChart({
  contributors,
  academicYears,
}: TopContributorsChartProps) {
  const [select, setSelect] = React.useState("all-academic-year")

  const data: ChartData<"bar"> = {
    labels: contributors.map(({ name }) => name),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    datasets: contributors.map(({ name, authorContributions }) => {
      const total = authorContributions.filter(({ academicYearId }) => {
        if (select === "all-academic-year") {
          return true
        } else {
          return academicYearId === select
        }
      })

      return {
        label: name,
        data: [{ x: total.length, y: name }],
        fill: true,
        grouped: false,
        borderWidth: 1,
        backgroundColor: `rgba(${getRandomColor()})`,
      }
    }),
  }

  return (
    <div className={styles["wrapper"]}>
      <h2 className={styles["text"]}>Top contributors</h2>

      <Select value={select} onValueChange={setSelect}>
        <SelectTrigger className={styles["select"]}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[
            { id: "all-academic-year", name: "All academic year" },
            ...academicYears,
          ].map(({ id, name }) => (
            <SelectItem value={id}>{name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Bar className={styles["chart"]} options={options} data={data} />
    </div>
  )
}
