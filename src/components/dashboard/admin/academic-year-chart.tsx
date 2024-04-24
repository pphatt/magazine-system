"use client"

import * as React from "react"
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

interface AcademicYearChartProps {
  data: ChartData<"bar">
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Total accept and reject contributions in a faculty",
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
}

export function AcademicYearChart({ data }: AcademicYearChartProps) {
  return <Bar options={options} data={data} />
}
