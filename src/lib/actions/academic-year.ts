"use server"

import { db } from "@/server/db"
import { ActiveStatusEnum } from "@prisma/client"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import {
  addAcademicYearSchema,
  deleteAcademicYearSchema,
  editAcademicYearSchema,
} from "@/lib/validations/academic-year"

export const createAcademicYear = async (
  values: z.infer<typeof addAcademicYearSchema>
) => {
  try {
    const { name, description, startDate, closureDate, finalClosureDate } =
      addAcademicYearSchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    await db.academicYear.create({
      data: {
        name,
        description: description ?? "",
        startDate,
        closureDate,
        finalClosureDate,
        creatorId: user.id,
      },
    })

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return {
      error: "Could not create academic year at this time. Please try later",
    }
  }
}

export const editAcademicYear = async (
  values: z.infer<typeof editAcademicYearSchema>
) => {
  try {
    const {
      academicYearId,
      name,
      description,
      startDate,
      closureDate,
      finalClosureDate,
      status,
    } = editAcademicYearSchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    await db.academicYear.update({
      where: {
        id: academicYearId,
      },
      data: {
        name,
        description,
        startDate,
        closureDate,
        finalClosureDate,
        status: status as ActiveStatusEnum,
      },
    })

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return {
      error: "Could not edit academic year at this time. Please try later",
    }
  }
}

export const deleteAcademicYear = async (
  values: z.infer<typeof deleteAcademicYearSchema>
) => {
  try {
    const { academicYearId } = deleteAcademicYearSchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    await db.academicYear.delete({
      where: {
        id: academicYearId,
      },
    })

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return {
      error: "Could not delete academic year at this time. Please try later",
    }
  }
}
