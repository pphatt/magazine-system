import Credentials from "@auth/core/providers/credentials"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"

import { getUserByEmail } from "@/lib/fetchers/user"
import { authSchema } from "@/lib/validations/auth"

export default {
  providers: [
    Credentials({
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/
      // @ts-ignore
      async authorize(credentials) {
        const validatedFields = authSchema.safeParse(credentials)

        if (!validatedFields.success) {
          return null
        }

        const { email, password } = validatedFields.data

        const user = await getUserByEmail(email)

        if (!user || !user.password) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (passwordsMatch) {
          return user
        }

        return null
      },
    }),
  ],
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
} satisfies NextAuthConfig
