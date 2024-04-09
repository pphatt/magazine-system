import * as z from "zod"

export const addFacultySchema = z.object({
  name: z.string().min(1, { message: "Faculty's name is required" }),
})

export const editFacultySchema = z.object({
  name: z.string().min(1, { message: "Faculty's name is required" }),
  facultyId: z.string().optional(),
  status: z.string()
})

export const deleteFacultySchema = z.object({
  facultyId: z.string(),
})

export const getFacultyWithUserSchema = z.object({
  query: z.string().default("undefined"),
  pageNumber: z.number().default(1),
  rowsNumber: z.number().default(50),
})
