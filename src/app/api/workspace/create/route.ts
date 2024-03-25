import { db } from "@/server/db"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import { workspaceSchema } from "@/lib/validations/workspace"
import type { WorkspaceCreationRequest } from "@/components/editor/editor"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WorkspaceCreationRequest

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { title, content, deadline } = workspaceSchema.parse(body)

    const user = await currentUser()

    if (!user || !user.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    await db.workspace.create({
      data: {
        title,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        content,
        deadline,
        faculty: user.faculty,
        creatorId: user.id,
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
        "Could not create workspace at this time. Please try later"
      ),
      { status: 500 }
    )
  }
}
