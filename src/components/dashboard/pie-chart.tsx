"use client"

import * as React from "react"
import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
  type ChartData,
} from "chart.js"
import { Pie } from "react-chartjs-2"

interface PieChartProps {
  data: ChartData<"pie">
}

ChartJS.register(ArcElement, Tooltip, Legend)

const options: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Percentage of contributions by each Faculty for any academic year.",
    },
    tooltip: {
      callbacks: {
        label: (value) => {
          const percentage = `Percentage of contributions: ${(value as { raw: string }).raw}%`
          return percentage
        },
      },
    },
  },
}

export function PieChart({ data }: PieChartProps) {
  return <Pie options={options} data={data} />
}
