"use server"

import { db } from "@/server/db"
import type { z } from "zod"

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

export async function getUserCountNotIncludeAdmin(query: string) {
  try {
    if (query !== "undefined") {
      return await db.user.count({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          role: {
            not: "ADMIN",
          },
        },
      })
    } else {
      return await db.user.count({
        where: {
          role: {
            not: "ADMIN",
          },
        },
      })
    }
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
    if (query !== "undefined") {
      return await db.user.findMany({
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
      return await db.user.findMany({
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
  } catch (err) {
    console.log(err)
    return null
  }
}
