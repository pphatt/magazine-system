"use client"

import React from "react"
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  type ChartData,
} from "chart.js"
import { Line } from "react-chartjs-2"

import styles from "@/styles/components/dashboard/chart.module.scss"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
    title: {
      display: true,
      text: "Total blogs of each faculty of each academic year",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Academic year",
      },
    },
    y: {
      type: "linear",
      title: {
        display: true,
        text: "Blogs Count",
      },
      display: true,
      scaleLabel: {
        display: true,
        labelString: "fpr",
        fontStyle: "bold",
      },
      min: 0,
      ticks: {
        stepSize: 1,
        autoSkip: true,
        beginAtZero: true,
      },
    },
  },
}

interface ManageChartProps {
  data: ChartData<"line">
}

export function ManageChart({ data }: ManageChartProps) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return <Line className={styles["chart"]} options={options} data={data} />
}
