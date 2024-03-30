import { z } from "zod"

export const searchParamsSchema = z.object({
  q: z.coerce.string(),
  page: z.coerce.string().default("1"),
  rows: z.coerce.string().default("50"),
})
