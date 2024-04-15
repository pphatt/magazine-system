import { db } from "@/server/db"

export const getSetPasswordTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email },
    })

    return passwordResetToken
  } catch {
    return null
  }
}
