import { db } from "@/server/db"
import { type StatusEnum } from "@prisma/client"
import type { z } from "zod"

import type { getBlogsWithUserSchema } from "@/lib/validations/blog"

export async function getBlogCount(status: string) {
  try {
    if (status === "all blogs") {
      return await db.blogs.count()
    }

    if (status !== "undefined") {
      return await db.blogs.count({
        where: { status: status.toUpperCase() as StatusEnum },
      })
    }

    return await db.blogs.count()
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getBlogsWithUser({
  pageNumber,
  rowsNumber,
  status,
  facultyId,
  academicYearId
}: z.infer<typeof getBlogsWithUserSchema>) {
  try {
    if (status === "approve") {
      return await db.blogs.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: { facultyId, academicYearId, publicized: false, status: "APPROVE" },
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    if (status === "pending") {
      return await db.blogs.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: { facultyId, academicYearId, publicized: false, status: "PENDING" },
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    if (status === "reject") {
      return await db.blogs.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: { facultyId, academicYearId, publicized: false, status: "REJECT" },
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    return await db.blogs.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: { facultyId, academicYearId, publicized: false },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}
