import type { FilePondFile } from "filepond"
import * as z from "zod"

const MAX_FILE_SIZE = 5000000
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

export const uploadBlogSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(128, {
      message: "Title must be less than 128 characters long",
    }),
  content: z.any(),
  image: z
    .custom<File>((val) => val instanceof File, "Please upload a file")
    .refine((file) => file?.size <= MAX_FILE_SIZE)
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Please choose .jpg, .jpeg and .png format files only",
    })
    .optional(),
  files: z.custom<FilePondFile[]>(),
  academicYearId: z.string(),
  facultyId: z.string(),
})

export const getBlogsWithUserSchema = z.object({
  query: z.string(),
  pageNumber: z.number().default(1),
  rowsNumber: z.number().default(50),
  status: z.coerce.string(),
  facultyId: z.coerce.string(),
  academicYearId: z.coerce.string(),
})

export const getBlogsWithUserByStudentSchema = z.object({
  query: z.string(),
  pageNumber: z.number().default(1),
  rowsNumber: z.number().default(50),
  facultyId: z.coerce.string(),
  academicYearId: z.coerce.string(),
})

export const getBlogsWithUserByMarketingManagerSchema = z.object({
  query: z.string(),
  pageNumber: z.number().default(1),
  rowsNumber: z.number().default(50),
  status: z.coerce.string(),
  academicYearId: z.coerce.string(),
  facultyId: z.coerce.string(),
})

export const getRecentBlogsSchema = z.object({
  userId: z.string(),
  pageNumber: z.number().default(1),
  rowsNumber: z.number().default(50),
  status: z.coerce.string(),
})

export const blogGradingSchema = z.object({
  blogId: z.coerce.string(),
  status: z.coerce.string(),
  marketingCoordinatorId: z.coerce.string(),
})

export const uploadEditBlogSchema = z.object({
  blogId: z.string(),
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(128, {
      message: "Title must be less than 128 characters long",
    }),
  content: z.any(),
  image: z
    .custom<File>((val) => val instanceof File, "Please upload a file")
    .refine((file) => file?.size <= MAX_FILE_SIZE)
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Please choose .jpg, .jpeg and .png format files only",
    })
    .optional(),
  prevImage: z.string().optional(),
  files: z.custom<FilePondFile[]>(),
  newFilesCount: z.number(),
  prevFiles: z.string().array().optional(),
  academicYearId: z.string(),
  facultyId: z.string(),
})
