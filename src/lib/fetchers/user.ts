"use server"

import { db } from "@/server/db"
import type { z } from "zod"

import type { UserWithFaculty } from "@/lib/prisma"
import type { getUserWithFacultySchema } from "@/lib/validations/user"

export async function getUserByEmail(email: string) {
  try {
    return db.user.findUnique({
      where: { email },
    })
  } catch (err) {
    return null
  }
}

export async function getUserById(id: string) {
  try {
    return db.user.findUnique({
      where: { id },
    })
  } catch (err) {
    return null
  }
}

export async function getUserCountNotIncludeAdmin() {
  try {
    return await db.user.count({
      where: {
        role: {
          not: "ADMIN",
        },
      },
    })
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function getUserWithFaculty({
  query,
  pageNumber,
  rowsNumber,
}: z.infer<typeof getUserWithFacultySchema>) {
  try {
    let users: UserWithFaculty[]

    if (query !== "undefined") {
      users = await db.user.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          role: {
            not: "ADMIN",
          },
        },
        include: {
          faculty: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    } else {
      users = await db.user.findMany({
        skip: (pageNumber - 1) * rowsNumber,
        take: rowsNumber,
        where: {
          role: {
            not: "ADMIN",
          },
        },
        include: {
          faculty: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    }

    return users
  } catch (err) {
    console.log(err)
    return null
  }
}
