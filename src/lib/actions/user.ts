"use server"

import { env } from "@/env"
import { db } from "@/server/db"
import { transporter } from "@/server/node-mailer/node-mailer"
import { supabase } from "@/server/supabase/supabase"
import type { UserRole } from "@prisma/client"
import { render } from "@react-email/components"
import bcrypt from "bcryptjs"
import { v4 } from "uuid"
import * as z from "zod"

import { currentUser } from "@/lib/auth/auth"
import generateSetPasswordToken from "@/lib/token"
import {
  addUserSchema,
  changeUserPasswordSchema,
  deleteUserSchema,
  type editProfileSchema,
  type editUserSchema,
} from "@/lib/validations/user"
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

export const editUser = async (formData: FormData) => {
  try {
    const { userId, prevImage, name, role, address, city, phoneNumber } =
      JSON.parse(formData.get("data") as string) as z.infer<
        typeof editUserSchema
      >

    const image = formData.get("image") as Blob | null

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    if (image) {
      if (prevImage) {
        await supabase.storage
          .from("avatar-assets")
          .remove([
            prevImage.split(
              `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatar-assets/`
            )[1]!,
          ])
      }

      const { data } = await supabase.storage
        .from("avatar-assets")
        .upload(v4(), image)

      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          address,
          city,
          role: role as UserRole,
          phoneNumber: phoneNumber,
          image: `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatar-assets/${data?.path}`,
        },
      })
    } else {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          address,
          city,
          role: role as UserRole,
          phoneNumber: phoneNumber,
        },
      })
    }

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not edit user at this time. Please try later" }
  }
}

export const deleteUser = async (values: z.infer<typeof deleteUserSchema>) => {
  try {
    const { userId } = deleteUserSchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    await db.user.delete({
      where: {
        id: userId,
      },
    })

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not delete user at this time. Please try later" }
  }
}

export const changeUserPassword = async (
  values: z.infer<typeof changeUserPasswordSchema>
) => {
  try {
    const { userId, newPassword } = changeUserPasswordSchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id) {
      return { error: "Unauthorized" }
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

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not create new user at this time. Please try later" }
  }
}

export const editUserProfile = async (formData: FormData) => {
  try {
    const { userId, prevImage, name, address, city, phoneNumber } = JSON.parse(
      formData.get("data") as string
    ) as z.infer<typeof editProfileSchema>

    const image = formData.get("image") as Blob | null

    const user = await currentUser()

    if (!user || !user.id) {
      return { error: "Unauthorized" }
    }

    if (image) {
      if (prevImage) {
        await supabase.storage
          .from("avatar-assets")
          .remove([
            prevImage.split(
              `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatar-assets/`
            )[1]!,
          ])
      }

      const { data } = await supabase.storage
        .from("avatar-assets")
        .upload(v4(), image)

      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          address,
          city,
          phoneNumber: phoneNumber,
          image: `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatar-assets/${data?.path}`,
        },
      })
    } else {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          address,
          city,
          phoneNumber: phoneNumber,
        },
      })
    }

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return {
      error: "Could not update user profile at this time. Please try later",
    }
  }
}
