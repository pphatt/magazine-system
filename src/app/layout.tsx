import "@/styles/globals.scss"

import { Inter } from "next/font/google"
import Script from "next/script"
import { Providers } from "@/providers/providers"
import { auth } from "@/server/auth/auth"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"

import { siteConfig } from "@/config/site"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning={true}>
        <head />
        <Script defer data-domain="mangado.org"></Script>
        <body className={inter.className}>
          <Providers
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </SessionProvider>
  )
}
