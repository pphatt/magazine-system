import authConfig from "@/server/auth/auth.config"
import { db } from "@/server/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { type FacultyEnum, type UserRole } from "@prisma/client"
import NextAuth from "next-auth"

import { getUserById } from "@/lib/fetchers/user"

declare module "next-auth" {
  interface User {
    role: UserRole
    faculty: FacultyEnum | null
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  events: {
    linkAccount({ user }) {
      console.log(user)
    },
  },
  callbacks: {
    session({ token, session }) {
      // session be access through rcc and rsc
      // session can get value from jwt through token => can see the token type is JWT
      // we can add any thing to token => something like token.customField = "anything" and it will deliver to the page
      // remember to add type in to it customField: string
      if (!session.user || !token.sub) {
        return session
      }

      session.user.id = token.sub
      session.user.role = token.role as UserRole
      session.user.faculty = token.faculty as FacultyEnum | null

      return session
    },
    async jwt({ token }) {
      // jwt token
      // token.sub === userId
      // token.name, token.email, ...
      // can assign new value to token and it carries it too

      if (!token.sub) return token

      const existedUser = await getUserById(token.sub)

      if (!existedUser) return token

      token.role = existedUser.role
      token.faculty = existedUser.faculty

      return token
    },
  },
  ...authConfig,
})
