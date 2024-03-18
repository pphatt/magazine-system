import { db } from "@/server/db"

export const getUserByEmail = async (email: string) => {
  try {
    return db.user.findUnique({
      where: { email },
    })
  } catch (err) {
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    return db.user.findUnique({
      where: { id },
    })
  } catch (err) {
    return null
  }
}
