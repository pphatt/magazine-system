import type { Prisma } from "@prisma/client"

export type UserWithFaculty = Prisma.UserGetPayload<{
  include: { faculty: true }
}>

export type FacultyWithUser = Prisma.FacultyGetPayload<{
  include: { creator: true }
}>