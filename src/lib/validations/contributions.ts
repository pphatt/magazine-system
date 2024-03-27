import * as z from "zod"

export const fileSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  files: z.any().optional(),
  location: z.array(z.string()).optional(),
})

export const fileEditSchema = fileSchema.and(
  z.object({
    contributionsId: z.string(),
  })
)

export const fileDeleteSchema = z.object({
  contributionsId: z.string(),
})