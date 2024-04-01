import * as z from "zod"

export const addAcademicYearSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    description: z.string().optional(),
    startDate: z.coerce.date(),
    closureDate: z.coerce.date(),
    finalClosureDate: z.coerce.date(),
  })
  .refine(({ startDate, closureDate }) => closureDate > startDate, {
    message: "Closure date cannot be earlier than start date.",
    path: ["closureDate"],
  })
  .refine(({ startDate, finalClosureDate }) => finalClosureDate > startDate, {
    message: "Final closure date cannot be earlier than start date.",
    path: ["finalClosureDate"],
  })
  .refine(
    ({ closureDate, finalClosureDate }) => finalClosureDate > closureDate,
    {
      message: "Final closure date cannot be earlier than closure date.",
      path: ["finalClosureDate"],
    }
  )

export const editAcademicYearSchema = z
  .object({
    academicYearId: z.string().optional(),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    description: z.string().optional(),
    startDate: z.coerce.date(),
    closureDate: z.coerce.date(),
    finalClosureDate: z.coerce.date(),
  })
  .refine(({ startDate, closureDate }) => closureDate > startDate, {
    message: "Closure date cannot be earlier than start date.",
    path: ["closureDate"],
  })
  .refine(({ startDate, finalClosureDate }) => finalClosureDate > startDate, {
    message: "Final closure date cannot be earlier than start date.",
    path: ["finalClosureDate"],
  })
  .refine(
    ({ closureDate, finalClosureDate }) => finalClosureDate > closureDate,
    {
      message: "Final closure date cannot be earlier than closure date.",
      path: ["finalClosureDate"],
    }
  )

export const getAcademicYearSchema = z.object({
  query: z.string().default("undefined"),
  pageNumber: z.number().default(1),
  rowsNumber: z.number().default(50),
})
