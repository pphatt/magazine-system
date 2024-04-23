import * as z from "zod"

export const commentSchema = z.object({
  contributionId: z.string(),
  text: z.string(),
  replyToId: z.string().optional(),
})
