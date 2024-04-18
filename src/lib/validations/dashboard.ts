import { z } from "zod"

export const dashboardParamsSchema = z.object({
  academicYearId: z.coerce.string().default(""),
})
