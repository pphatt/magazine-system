import * as React from "react"
import type { User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import { CoordinatorDashboard } from "@/components/dashboard/coordinator-dashboard"
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard"

export default async function ManagePage() {
  const user = (await currentUser()) as User

  if (user.role === "MARKETING_MANAGER") {
    return <ManagerDashboard />
  }

  return <CoordinatorDashboard user={user} />
}
