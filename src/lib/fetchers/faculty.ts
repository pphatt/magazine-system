import { db } from "@/server/db"
import type { z } from "zod"

import type { FacultyWithUser } from "@/lib/prisma"
import type { getFacultyWithUserSchema } from "@/lib/validations/faculty"

export async function getFacultyCount() {
  try {
    return await db.faculty.count()
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getFacultyWithUser({
  query,
  pageNumber,
  rowsNumber,
}: z.infer<typeof getFacultyWithUserSchema>) {
  try {
    let faculties: FacultyWithUser[]

    if (query !== "undefined") {
      faculties = await db.faculty.findMany({
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
      faculties = await db.faculty.findMany({
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

    return faculties
  } catch (err) {
    console.log(err)
    return null
  }
}
