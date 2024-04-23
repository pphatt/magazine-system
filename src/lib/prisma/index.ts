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

export type ContributionWithUser = Prisma.ContributionsGetPayload<{
  include: {
    author: true
    comments: true
    marketingCoordinator: true
    like: true
    save: true
  }
}>

export type ContributionWithUserWithInclude = Prisma.ContributionsGetPayload<{
  include: {
    author: true
    faculty: true
    academicYear: true
    like: true
    save: true
  }
}>

export type LikeIncludeContribution = Prisma.LikeContributionsGetPayload<{
  include: { contribution: true }
}> & {
  contribution: Prisma.ContributionsGetPayload<{
    include: {
      author: true
      faculty: true
      academicYear: true
      like: true
      comments: true
      marketingCoordinator: true
      save: true
    }
  }>
}

export type SaveIncludeBlog = Prisma.SaveContributionsGetPayload<{
  include: { contribution: true }
}> & {
  contribution: Prisma.ContributionsGetPayload<{
    include: {
      author: true
      faculty: true
      academicYear: true
      like: true
      comments: true
      marketingCoordinator: true
      save: true
    }
  }>
}

export type ContributionsWithAcademicYear = Prisma.AcademicYearGetPayload<{
  include: { contributions: true }
}>
