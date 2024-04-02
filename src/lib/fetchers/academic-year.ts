import { db } from "@/server/db"
import type { z } from "zod"

import type { getAcademicYearSchema } from "@/lib/validations/academic-year"

export async function getAcademicYearCount(query: string) {
  try {
    if (query !== "undefined") {
      return await db.academicYear.count({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      })
    } else {
      return await db.academicYear.count()
    }
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getAcademicYearWithUser({
  query,
  pageNumber,
  rowsNumber,
}: z.infer<typeof getAcademicYearSchema>) {
  try {
    if (query !== "undefined") {
      return await db.academicYear.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          creator: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    } else {
      return await db.academicYear.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        include: {
          creator: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }
  } catch (err) {
    console.log(err)
    return null
  }
}
