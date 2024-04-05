import { db } from "@/server/db"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import { addAcademicYearSchema } from "@/lib/validations/academic-year"
import type { AddAcademicYearInputs } from "@/components/add-academic-year"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AddAcademicYearInputs

    const { name, description, startDate, closureDate, finalClosureDate } =
      addAcademicYearSchema.parse(body)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 401 })
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

    return new Response(JSON.stringify("OK"), { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.message), { status: 400 })
    }

    return new Response(
      JSON.stringify(
        "Could not create academic year at this time. Please try later"
      ),
      { status: 500 }
    )
  }
}
