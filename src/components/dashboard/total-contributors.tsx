"use client"

import React from "react"
import type { AcademicYear, Faculty } from "@prisma/client"
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

import type { ContributionsWithAcademicYear, Contributors } from "@/lib/prisma"
import { getRandomColor } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import styles from "@/styles/components/dashboard/contribution-percentage-chart.module.scss"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
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
          const percentage = `${value.label}: ${value.formattedValue} contributors`
          return percentage
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Faculty",
      },
    },
    y: {
      title: {
        display: true,
        text: "Total contributors of each faculty",
      },
      suggestedMax: 20,
    },
  },
}

interface TotalContributorsChartProps {
  contributors: ContributionsWithAcademicYear[]
  faculty: Faculty[]
  academicYear: AcademicYear[]
}

export function TotalContributorsChart({
  contributors,
  faculty,
  academicYear,
}: TotalContributorsChartProps) {
  const [select, setSelect] = React.useState(academicYear[0]?.id ?? "")

  const sortContributorsOnAcademicYear = contributors.find(
    ({ id }) => id === select
  )!

  const data: ChartData<"bar"> = {
    labels: faculty.map(({ name }) => name),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    datasets: faculty.map(({ id, name }) => {
      const sortContributionsOnFaculty =
        sortContributorsOnAcademicYear.contributions.filter(
          ({ facultyId }) => facultyId === id
        )

      const uniqueUserIds = new Set();

      // Count distinct contributors for the current faculty
      sortContributionsOnFaculty.forEach(({ authorId }) => {
        uniqueUserIds.add(authorId);
      });

      const contributorCount = uniqueUserIds.size;

      return {
        label: name,
        data: [{ x: name, y: contributorCount }],
        fill: true,
        grouped: false,
        borderWidth: 1,
        backgroundColor: `rgba(${getRandomColor()})`,
      }
    }),
  }

  return (
    <div className={styles["wrapper"]}>
      <h2 className={styles["text"]}>Numbers of Contributors</h2>

      <Select value={select} onValueChange={setSelect}>
        <SelectTrigger className={styles["select"]}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {academicYear.map(({ id, name }) => (
            <SelectItem value={id}>{name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Bar className={styles["chart"]} options={options} data={data} />
    </div>
  )
}
