"use server"

import { db } from "@/server/db"
import { type StatusEnum } from "@prisma/client"
import type { z } from "zod"

import type {
  getContributionWithUserByGuestSchema,
  getContributionWithUserByMarketingManagerSchema,
  getContributionWithUserByStudentSchema,
  getContributionsWithUserSchema,
  getLikeContributionSchema,
  getRecentContributionSchema,
} from "@/lib/validations/contribution"

export async function getContributionCount(
  query: string,
  facultyId: string,
  academicYearId: string,
  status: string
) {
  try {
    if (status === "all blogs") {
      return await db.contributions.count({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          academicYearId,
          facultyId,
        },
      })
    }

    if (status !== "undefined") {
      return await db.contributions.count({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          academicYearId,
          facultyId,
          status: status.toUpperCase() as StatusEnum,
        },
      })
    }

    return await db.contributions.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        academicYearId,
        facultyId,
      },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getContributionsWithUser({
  pageNumber,
  rowsNumber,
  query,
  status,
  facultyId,
  academicYearId,
}: z.infer<typeof getContributionsWithUserSchema>) {
  try {
    if (status === "approve") {
      return await db.contributions.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          facultyId,
          academicYearId,
          status: "APPROVE",
        },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true,
          like: true,
          save: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    if (status === "pending") {
      return await db.contributions.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          facultyId,
          academicYearId,
          status: "PENDING",
        },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true,
          like: true,
          save: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    if (status === "reject") {
      return await db.contributions.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          facultyId,
          academicYearId,
          status: "REJECT",
        },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true,
          like: true,
          save: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    return await db.contributions.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        facultyId,
        academicYearId,
      },
      include: {
        author: true,
        comments: true,
        marketingCoordinator: true,
        like: true,
        save: true,
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

export async function getContributionCountByStudent(
  query: string,
  facultyId: string,
  academicYearId: string
) {
  try {
    return await db.contributions.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        facultyId,
        academicYearId,
        publicized: true,
        status: "APPROVE",
      },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getContributionsWithUserByStudent({
  query,
  pageNumber,
  rowsNumber,
  facultyId,
  academicYearId,
}: z.infer<typeof getContributionWithUserByStudentSchema>) {
  try {
    return await db.contributions.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        facultyId,
        academicYearId,
        publicized: true,
        status: "APPROVE",
      },
      include: {
        author: true,
        comments: true,
        marketingCoordinator: true,
        like: true,
        save: true,
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

export async function getRecentContributionCount(
  query: string,
  userId: string,
  academicYearId: string,
  status: string
) {
  try {
    if (status === "all blogs") {
      return await db.contributions.count({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          authorId: userId,
          academicYearId,
        },
      })
    }

    if (status !== "undefined") {
      return await db.contributions.count({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          authorId: userId,
          academicYearId,
          status: status.toUpperCase() as StatusEnum,
        },
      })
    }

    return await db.contributions.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        authorId: userId,
        academicYearId,
      },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getRecentContributions({
  query,
  userId,
  pageNumber,
  rowsNumber,
  status,
  academicYearId,
}: z.infer<typeof getRecentContributionSchema>) {
  try {
    if (status === "approve") {
      return await db.contributions.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          authorId: userId,
          academicYearId,
          status: "APPROVE",
        },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true,
          like: true,
          save: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    if (status === "pending") {
      return await db.contributions.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          authorId: userId,
          academicYearId,
          status: "PENDING",
        },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true,
          like: true,
          save: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    if (status === "reject") {
      return await db.contributions.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          authorId: userId,
          academicYearId,
          status: "REJECT",
        },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true,
          like: true,
          save: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    return await db.contributions.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        authorId: userId,
        academicYearId,
      },
      include: {
        author: true,
        comments: true,
        marketingCoordinator: true,
        like: true,
        save: true,
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

export async function getContributionCountByMarketingManager(
  query: string,
  facultyId: string,
  academicYearId: string,
  status: string
) {
  try {
    if (status === "all blogs") {
      return await db.contributions.count({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          academicYearId,
          facultyId,
        },
      })
    }

    if (status !== "undefined") {
      return await db.contributions.count({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          academicYearId,
          facultyId,
          status: status.toUpperCase() as StatusEnum,
        },
      })
    }

    return await db.contributions.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        academicYearId,
        facultyId,
      },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getContributionsWithUserByMarketingManager({
  query,
  pageNumber,
  rowsNumber,
  status,
  academicYearId,
  facultyId,
}: z.infer<typeof getContributionWithUserByMarketingManagerSchema>) {
  try {
    if (status === "all blogs") {
      return await db.contributions.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          academicYearId,
          facultyId,
        },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true,
          like: true,
          save: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    }

    if (status !== "undefined") {
      return await db.contributions.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
          academicYearId,
          facultyId,
          status: status.toUpperCase() as StatusEnum,
        },
        include: {
          author: true,
          comments: true,
          marketingCoordinator: true,
          like: true,
          save: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    }

    return await db.contributions.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        academicYearId,
        facultyId,
      },
      include: {
        author: true,
        comments: true,
        marketingCoordinator: true,
        like: true,
        save: true,
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

export async function getContributionCountByGuest(query: string) {
  try {
    return await db.contributions.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        allowGuest: true,
      },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getContributionsWithUserByGuest({
  query,
  pageNumber,
  rowsNumber,
}: z.infer<typeof getContributionWithUserByGuestSchema>) {
  try {
    return await db.contributions.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: {
        allowGuest: true,
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        author: true,
        comments: true,
        marketingCoordinator: true,
        like: true,
        save: true,
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

export async function getLikeContributionsCount(query: string, userId: string) {
  try {
    return await db.contributions.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        like: {
          some: {
            userId: userId,
          },
        },
      },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getLikeContributions({
  query,
  userId,
  pageNumber,
  rowsNumber,
}: z.infer<typeof getLikeContributionSchema>) {
  try {
    return await db.likeContributions.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: {
        userId: userId,
        contribution: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
      include: {
        contribution: {
          include: {
            like: true,
            author: true,
            comments: true,
            marketingCoordinator: true,
            save: true,
          },
        },
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

export async function getSaveContributionCount(query: string, userId: string) {
  try {
    return await db.contributions.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        save: {
          some: {
            userId: userId,
          },
        },
      },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getSaveContributions({
  query,
  userId,
  pageNumber,
  rowsNumber,
}: z.infer<typeof getLikeContributionSchema>) {
  try {
    return await db.saveContributions.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: {
        userId: userId,
        contribution: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
      include: {
        contribution: {
          include: {
            like: true,
            author: true,
            comments: true,
            marketingCoordinator: true,
            save: true,
          },
        },
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
