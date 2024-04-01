import { db } from "@/server/db"
import type { z } from "zod"

import type { getFacultyWithUserSchema } from "@/lib/validations/faculty"

export async function getFacultyCount(query: string) {
  try {
    if (query !== "undefined") {
      return await db.faculty.count({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      })
    } else {
      return await db.faculty.count()
    }
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
    if (query !== "undefined") {
      return await db.faculty.findMany({
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
      return await db.faculty.findMany({
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
