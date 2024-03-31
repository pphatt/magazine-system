import { db } from "@/server/db"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import { deleteUserSchema } from "@/lib/validations/user"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as z.infer<typeof deleteUserSchema>

    const { userId } = deleteUserSchema.parse(body)

    const user = await currentUser()

    if (!user || !user.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    await db.user.delete({
      where: {
        id: userId,
      },
    })

    return new Response(JSON.stringify("OK"), { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.message), { status: 400 })
    }

    return new Response(
      JSON.stringify("Could not delete user at this time. Please try later"),
      { status: 500 }
    )
  }
}
