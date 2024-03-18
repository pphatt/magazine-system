import { auth } from "@/server/auth/auth"

export async function currentUser() {
  const session = await auth()

  return session?.user
}
