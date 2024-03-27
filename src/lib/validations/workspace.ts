import * as z from "zod"

export const workspaceSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(128, {
      message: "Title must be less than 128 characters long",
    }),
  content: z.any(),
  closureDate: z.coerce.date(),
  finalClosureDate: z.coerce.date(),
})
