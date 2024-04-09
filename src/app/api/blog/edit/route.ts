import { db } from "@/server/db"
import { supabase } from "@/server/supabase/supabase"
import { v4 } from "uuid"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import type { uploadEditBlogSchema } from "@/lib/validations/blog"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const {
      blogId,
      title,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      content,
      facultyId,
      academicYearId,
      prevImage,
      prevFiles,
      newFilesCount,
    } = JSON.parse(formData.get("data") as string) as z.infer<
      typeof uploadEditBlogSchema
    >

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

    let filesUrl: string[] = prevFiles!

    if (newFilesCount > 0) {
      filesUrl = []

      for (const file of files) {
        await supabase.storage.from("student-contributions").remove(prevFiles!)

        const { data } = await supabase.storage
          .from("student-contributions")
          .upload(
            `${facultyId}/${academicYearId}/${user.id}/${v4()}/${file.name}`,
            file
          )

        filesUrl.push(data?.path ?? "")
      }
    }

    const image = formData.get("image") as Blob | null

    let imageUrl = prevImage

    if (image) {
      await supabase.storage.from("student-contributions").remove([prevImage!])

      const { data } = await supabase.storage
        .from("student-contributions")
        .upload(`${facultyId}/${academicYearId}/${user.id}/${v4()}`, image)

      imageUrl = data?.path ?? ""
    }

    const { id } = await db.blogs.update({
      where: {
        id: blogId,
      },
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

    return new Response(JSON.stringify({ blogId: id }), { status: 200 })
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
