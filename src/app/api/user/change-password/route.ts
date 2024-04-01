import { db } from "@/server/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import { changeUserPasswordSchema } from "@/lib/validations/user"
import { type ChangeUserPasswordInputs } from "@/components/edit-user"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChangeUserPasswordInputs

    const { userId, newPassword } = changeUserPasswordSchema.parse(body)

    const user = await currentUser()

    if (!user || !user.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
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
        "Could not create new user at this time. Please try later"
      ),
      { status: 500 }
    )
  }
}
