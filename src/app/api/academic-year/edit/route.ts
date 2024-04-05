import { db } from "@/server/db"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import { editAcademicYearSchema } from "@/lib/validations/academic-year"
import type { EditAcademicYearInputs } from "@/components/edit-academic-year"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as EditAcademicYearInputs

    const {
      academicYearId,
      name,
      description,
      startDate,
      closureDate,
      finalClosureDate,
    } = editAcademicYearSchema.parse(body)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 401 })
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
      },
    })

    return new Response(JSON.stringify("OK"), { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.message), { status: 400 })
    }

    return new Response(
      JSON.stringify(
        "Could not edit academic year at this time. Please try later"
      ),
      { status: 500 }
    )
  }
}
