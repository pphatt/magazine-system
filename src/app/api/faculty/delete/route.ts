import { db } from "@/server/db"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import { deleteFacultySchema } from "@/lib/validations/faculty"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as z.infer<typeof deleteFacultySchema>

    const { facultyId } = deleteFacultySchema.parse(body)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 401 })
    }

    await db.faculty.delete({
      where: {
        id: facultyId,
      },
    })

    return new Response(JSON.stringify("OK"), { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.message), { status: 400 })
    }

    return new Response(
      JSON.stringify("Could not delete faculty at this time. Please try later"),
      { status: 500 }
    )
  }
}
