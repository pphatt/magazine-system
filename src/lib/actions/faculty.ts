"use server"

import { db } from "@/server/db"
import type { ActiveStatusEnum } from "@prisma/client"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import {
  addFacultySchema,
  deleteFacultySchema,
  editFacultySchema,
} from "@/lib/validations/faculty"

export const addFaculty = async (values: z.infer<typeof addFacultySchema>) => {
  try {
    const { name } = addFacultySchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    await db.faculty.create({
      data: {
        name,
        creatorId: user.id,
      },
    })

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not create faculty at this time. Please try later" }
  }
}

export const editFaculty = async (
  values: z.infer<typeof editFacultySchema>
) => {
  try {
    const { name, facultyId, status } = editFacultySchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    await db.faculty.update({
      where: {
        id: facultyId,
      },
      data: {
        name,
        status: status as ActiveStatusEnum,
      },
    })

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not edit faculty at this time. Please try later" }
  }
}

export const deleteFaculty = async (
  values: z.infer<typeof deleteFacultySchema>
) => {
  try {
    const { facultyId } = deleteFacultySchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    await db.faculty.delete({
      where: {
        id: facultyId,
      },
    })

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not delete faculty at this time. Please try later" }
  }
}
