import type { Prisma } from "@prisma/client"

export type UserWithFaculty = Prisma.UserGetPayload<{
  include: { faculty: true }
}>

export type FacultyWithUser = Prisma.FacultyGetPayload<{
  include: { creator: true }
}>

export type AcademicYearWithUser = Prisma.AcademicYearGetPayload<{
  include: { creator: true }
}>

export type BlogWithUser = Prisma.BlogsGetPayload<{
  include: { author: true; comments: true }
}>

export type BlogWithInclude = Prisma.BlogsGetPayload<{
  include: { author: true; faculty: true; academicYear: true }
}>
