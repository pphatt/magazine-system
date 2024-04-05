import * as React from "react"
import { db } from "@/server/db"
import type { User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import type { UserWithFaculty } from "@/lib/prisma"
import { EditProfile } from "@/app/(settings)/settings/_components/edit-profile"

export default async function ProfilePage() {
  const user = (await currentUser()) as User

  const userWithFaculty = (await db.user.findUnique({
    where: { id: user.id },
    include: {
      faculty: true,
    },
  })) as UserWithFaculty

  return <EditProfile user={userWithFaculty} />
}
