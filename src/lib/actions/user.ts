"use server"

import { db } from "@/server/db"
import { transporter } from "@/server/node-mailer/node-mailer"
import type { UserRole } from "@prisma/client"
import { render } from "@react-email/components"
import * as z from "zod"

import { currentUser } from "@/lib/auth/auth"
import generateSetPasswordToken from "@/lib/token"
import { addUserSchema } from "@/lib/validations/user"
import { SetPasswordEmail } from "@/components/emails/set-password-email"

export const createUser = async (
  values: z.infer<typeof addUserSchema>
): Promise<{ success: string } | { error: string }> => {
  try {
    const {
      email,
      role,
      faculty,
      firstName,
      lastName,
      address,
      city,
      phoneNumber,
    } = addUserSchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    const checkUser = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (checkUser) {
      return { error: "Email already exists" }
    }

    await db.user.create({
      data: {
        email,
        name: firstName + " " + lastName,
        role: role as UserRole,
        facultyId: faculty ? faculty : null,
        address,
        city,
        phoneNumber: phoneNumber,
      },
    })

    const { token } = await generateSetPasswordToken(email)

    const html = render(SetPasswordEmail({ email, token: token }))

    await transporter.sendMail({
      from: "Do not reply to this email <magazine@greenwich.magazine.edu>",
      subject: "Set password for new user",
      to: `${email}`,
      html,
    })

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not create new user at this time. Please try later" }
  }
}
