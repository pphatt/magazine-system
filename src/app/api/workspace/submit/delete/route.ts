import { db } from "@/server/db"
import { z } from "zod"

import {
  fileDeleteSchema,
} from "@/lib/validations/contributions"
import type { FileInputs } from "@/components/submit-contributions"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as FileInputs

    const { contributionsId } = fileDeleteSchema.parse(body)

    await db.contributions.delete({
      where: { id: contributionsId },
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
