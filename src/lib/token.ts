import { db } from "@/server/db"
import { v4 as uuidv4 } from "uuid"

import { getSetPasswordTokenByEmail } from "@/lib/fetchers/set-password"

export default async function generateSetPasswordToken(email: string) {
  const token = uuidv4()

  const existingToken = await getSetPasswordTokenByEmail(email)

  if (existingToken) {
    await db.setPasswordToken.delete({
      where: { id: existingToken.id },
    })
  }

  const setPasswordToken = await db.setPasswordToken.create({
    data: {
      email,
      token,
    },
  })

  return setPasswordToken
}

export const getSetPasswordTokenByToken = async (token: string) => {
  try {
    const setPasswordToken = await db.setPasswordToken.findUnique({
      where: { token },
    })

    return setPasswordToken
  } catch {
    return null
  }
}
