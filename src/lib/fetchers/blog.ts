import { db } from "@/server/db"
import { type StatusEnum } from "@prisma/client"
import type { z } from "zod"

import type {
  getBlogsWithUserByMarketingManagerSchema,
  getBlogsWithUserByStudentSchema,
  getBlogsWithUserSchema,
  getRecentBlogsSchema,
} from "@/lib/validations/blog"

export async function getBlogCount(academicYearId: string, status: string) {
  try {
    if (status === "all blogs") {
      return await db.blogs.count({
        where: { academicYearId },
      })
    }

    if (status !== "undefined") {
      return await db.blogs.count({
        where: { academicYearId, status: status.toUpperCase() as StatusEnum },
      })
    }

    return await db.blogs.count({
      where: { academicYearId },
    })
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
  academicYearId,
}: z.infer<typeof getBlogsWithUserSchema>) {
  try {
    if (status === "approve") {
      return await db.blogs.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: { facultyId, academicYearId, status: "APPROVE" },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true
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
        where: { facultyId, academicYearId, status: "PENDING" },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true
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
        where: { facultyId, academicYearId, status: "REJECT" },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    return await db.blogs.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: { facultyId, academicYearId },
      include: {
        author: true,
        comments: true,
        marketingCoordinator: true
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

export async function getBlogCountByStudent(academicYearId: string) {
  try {
    return await db.blogs.count({
      where: { academicYearId, publicized: true, status: "APPROVE" },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getBlogsWithUserByStudent({
  pageNumber,
  rowsNumber,
  facultyId,
  academicYearId,
}: z.infer<typeof getBlogsWithUserByStudentSchema>) {
  try {
    return await db.blogs.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: { facultyId, academicYearId, publicized: true, status: "APPROVE" },
      include: {
        author: true,
        comments: true,
        marketingCoordinator: true,
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

export async function getRecentBlogCount(userId: string, status: string) {
  try {
    if (status === "all blogs") {
      return await db.blogs.count({
        where: { authorId: userId },
      })
    }

    if (status !== "undefined") {
      return await db.blogs.count({
        where: { authorId: userId, status: status.toUpperCase() as StatusEnum },
      })
    }

    return await db.blogs.count({
      where: { authorId: userId },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getRecentBlogs({
  userId,
  pageNumber,
  rowsNumber,
  status,
}: z.infer<typeof getRecentBlogsSchema>) {
  try {
    if (status === "approve") {
      return await db.blogs.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: { authorId: userId, status: "APPROVE" },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true
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
        where: { authorId: userId, status: "PENDING" },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true
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
        where: { authorId: userId, status: "REJECT" },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    return await db.blogs.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: { authorId: userId },
      include: {
        author: true,
        comments: true,
        marketingCoordinator: true
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

export async function getBlogCountByMarketingManager(
  facultyId: string,
  academicYearId: string,
  status: string
) {
  try {
    if (status === "all blogs") {
      return await db.blogs.count({
        where: { academicYearId, facultyId },
      })
    }

    if (status !== "undefined") {
      return await db.blogs.count({
        where: {
          academicYearId,
          facultyId,
          status: status.toUpperCase() as StatusEnum,
        },
      })
    }

    return await db.blogs.count({
      where: { academicYearId, facultyId },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getBlogsWithUserByMarketingManager({
  pageNumber,
  rowsNumber,
  status,
  academicYearId,
  facultyId,
}: z.infer<typeof getBlogsWithUserByMarketingManagerSchema>) {
  try {
    if (status === "all blogs") {
      return await db.blogs.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: { academicYearId, facultyId },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    }

    if (status !== "undefined") {
      return await db.blogs.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          academicYearId,
          facultyId,
          status: status.toUpperCase() as StatusEnum,
        },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    }

    return await db.blogs.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: { academicYearId, facultyId },
      include: {
        author: true,
        comments: true,
        marketingCoordinator: true
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}
