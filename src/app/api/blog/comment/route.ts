import { db } from "@/server/db"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import { commentSchema } from "@/lib/validations/comment"
import type { CommentInputs } from "@/components/comments/comments-input"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CommentInputs

    const { text, blogId, replyToId } = commentSchema.parse(body)

    const user = await currentUser()

    if (!user || !user.id) {
      return new Response("Need to login to comment", { status: 401 })
    }

    await db.comment.create({
      data: {
        text,
        replyToId,
        blogId,
        authorId: user.id,
      },
    })

    return new Response(JSON.stringify("OK"), { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.message), { status: 400 })
    }

    return new Response(
      JSON.stringify("Could not create faculty at this time. Please try later"),
      { status: 500 }
    )
  }
}
