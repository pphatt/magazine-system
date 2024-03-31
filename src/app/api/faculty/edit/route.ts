import { db } from "@/server/db"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import { editFacultySchema } from "@/lib/validations/faculty"
import type { EditFacultyInputs } from "@/components/edit-faculty"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as EditFacultyInputs

    const { name, facultyId } = editFacultySchema.parse(body)

    const user = await currentUser()

    if (!user || !user.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    await db.faculty.update({
      where: {
        id: facultyId,
      },
      data: {
        name,
      },
    })

    return new Response(JSON.stringify("OK"), { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.message), { status: 400 })
    }

    return new Response(
      JSON.stringify("Could not edit faculty at this time. Please try later"),
      { status: 500 }
    )
  }
}
