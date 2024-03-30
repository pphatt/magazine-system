import { db } from "@/server/db"
import { type UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import { addUserSchema } from "@/lib/validations/user"
import type { AddUserInputs } from "@/components/add-user"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AddUserInputs

    const {
      email,
      password,
      role,
      faculty,
      firstName,
      lastName,
      address,
      city,
      phoneNumber,
    } = addUserSchema.parse(body)

    const user = await currentUser()

    if (!user || !user.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: firstName + " " + lastName,
        role: role as UserRole,
        facultyId: faculty ? faculty : null,
        address,
        city,
        phoneNumber: parseInt(phoneNumber),
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
