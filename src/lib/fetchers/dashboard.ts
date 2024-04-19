import { db } from "@/server/db"
import { ChartData } from "chart.js"

interface getAcademicYearIdType {
  academicYearId: string
}

export async function getAcceptAndRejectInFaculty({
  academicYearId,
}: getAcademicYearIdType) {
  const faculty = await db.faculty.findMany()

  const data: ChartData<"bar"> = {
    labels: faculty.map(({ name }) => name),
    datasets: [
      {
        label: "Accept",
        data: [],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Reject",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }

  for (const { name } of faculty) {
    const facultyBlogs = await db.blogs.findMany({
      where: {
        faculty: { name },
        academicYearId: {
          contains: academicYearId,
          mode: "insensitive",
        },
        status: {
          in: ["APPROVE", "REJECT"],
        },
      },
    })

    let acceptCount = 0
    let rejectCount = 0

    for (const { status } of facultyBlogs) {
      if (status === "APPROVE") {
        acceptCount++
      } else if (status === "REJECT") {
        rejectCount++
      }
    }

    data.datasets[0]!.data.push(acceptCount)
    data.datasets[1]!.data.push(rejectCount)
  }

  return data
}

export async function getPieChartData({
  academicYearId,
}: getAcademicYearIdType) {
  const faculty = await db.faculty.findMany()

  const data: ChartData<"pie"> = {
    labels: [],
    datasets: [
      {
        label: "Percentage of contributions",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const total = await db.blogs.findMany({
    where: { academicYearId },
  })

  for (const { name } of faculty) {
    const countBlogs = await db.blogs.count({
      where: {
        faculty: { name },
        academicYearId,
      },
    })

    if (countBlogs > 0) {
      data.labels!.push(name)

      const percentage = (countBlogs / total.length) * 100

      data.datasets[0]!.data.push(percentage)
    }
  }

  return data
}
