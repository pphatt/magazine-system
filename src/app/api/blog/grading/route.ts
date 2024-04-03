import { db } from "@/server/db"
import { StatusEnum } from "@prisma/client"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import { blogGradingSchema } from "@/lib/validations/blog"
import type { BlogGradingFormInputs } from "@/components/student-submission-grading"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BlogGradingFormInputs

    const { blogId, status } = blogGradingSchema.parse(body)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "MARKETING_COORDINATOR") {
      return new Response("Unauthorized", { status: 401 })
    }

    await db.blogs.update({
      where: { id: blogId },
      data: {
        publicized: true,
        status: status as StatusEnum,
      },
    })

    return new Response(JSON.stringify("OK"), { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.message), { status: 400 })
    }

    return new Response(
      JSON.stringify("Could not grading blog at this time. Please try later"),
      { status: 500 }
    )
  }
}
