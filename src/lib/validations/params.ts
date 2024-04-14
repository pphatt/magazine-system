import { z } from "zod"

export const searchParamsSchema = z.object({
  q: z.coerce.string(),
  page: z.coerce.string().default("1"),
  rows: z.coerce.string(),
})

export const contributionParamsSchema = z.object({
  facultyId: z.coerce.string(),
  academicYearId: z.coerce.string(),
  q: z.coerce.string(),
  page: z.coerce.string().default("1"),
  rows: z.coerce.string(),
  // STUDENT, MC => blog status
  status: z.coerce.string().default("ALL BLOGS"),
})

export const recentBlogParamsSchema = z.object({
  page: z.coerce.string().default("1"),
  row: z.coerce.string(),
  status: z.coerce.string().default("pending"),
})
