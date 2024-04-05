import { env } from "@/env"
import { db } from "@/server/db"
import { supabase } from "@/server/supabase/supabase"
import { v4 } from "uuid"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import { type editProfileSchema } from "@/lib/validations/user"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const { userId, prevImage, name, address, city, phoneNumber } = JSON.parse(
      formData.get("data") as string
    ) as z.infer<typeof editProfileSchema>

    const image = formData.get("image") as Blob | null

    const user = await currentUser()

    if (!user || !user.id) {
      return new Response("Unauthorized", { status: 401 })
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

    return new Response(JSON.stringify("OK"), { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.message), { status: 400 })
    }

    return new Response(
      JSON.stringify(
        "Could not update user profile at this time. Please try later"
      ),
      { status: 500 }
    )
  }
}
