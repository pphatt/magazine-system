import { db } from "@/server/db"
import { supabase } from "@/server/supabase/supabase"
import { v4 } from "uuid"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import type { uploadBlogSchema } from "@/lib/validations/blog"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { title, content, facultyId, academicYearId } = JSON.parse(
      formData.get("data") as string
    ) as z.infer<typeof uploadBlogSchema>

    const user = await currentUser()

    if (!user || !user.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const files = formData.getAll("files[]") as File[] | null

    if (!files) {
      return new Response(JSON.stringify("No submit files were recorded"), {
        status: 400,
      })
    }

    const filesUrl: string[] = []

    for (const file of files) {
      const { data } = await supabase.storage
        .from("student-contributions")
        .upload(`${facultyId}/${academicYearId}/${user.id}/${v4()}/${file.name}`, file)

      filesUrl.push(data?.path ?? "")
    }

    const image = formData.get("image") as Blob | null

    let imageUrl: string | null = null

    if (image) {
      const { data } = await supabase.storage
        .from("student-contributions")
        .upload(`${facultyId}/${academicYearId}/${user.id}/${v4()}`, image)

      imageUrl = data?.path ?? ""
    }

    await db.blogs.create({
      data: {
        title,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        content,
        backgroundImage: imageUrl ?? "",
        facultyId,
        academicYearId,
        authorId: user.id,
        location: filesUrl,
      },
    })

    return new Response(JSON.stringify("OK"), { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.message), { status: 400 })
    }

    return new Response(
      JSON.stringify("Could not upload blog at this time. Please try later"),
      { status: 500 }
    )
  }
}
