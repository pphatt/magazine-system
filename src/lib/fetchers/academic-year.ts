import { db } from "@/server/db"
import type { z } from "zod"

import type { getAcademicYearSchema } from "@/lib/validations/academic-year"
import {type AcademicYearWithUser} from "@/lib/prisma";

export async function getAcademicYearCount() {
  try {
    return await db.academicYear.count()
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
    let academicYears: AcademicYearWithUser[]

    if (query !== "undefined") {
      academicYears = await db.academicYear.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          creator: true
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    } else {
      academicYears = await db.academicYear.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        include: {
          creator: true
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    return academicYears
  } catch (err) {
    console.log(err)
    return null
  }
}
