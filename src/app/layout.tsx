import "@/styles/globals.scss"

import { Inter } from "next/font/google"
import Script from "next/script"
import { Providers } from "@/providers/providers"
import TanstackProviders from "@/providers/tanstack-providers"
import { auth } from "@/server/auth/auth"
import { SessionProvider } from "next-auth/react"
import NextTopLoader from "nextjs-toploader"
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
          <TanstackProviders>
            <Providers
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader
                color="#2299DD"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={true}
                easing="ease"
                speed={200}
                shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              />
              {children}
              <Toaster position="top-right" richColors />
            </Providers>
          </TanstackProviders>
        </body>
      </html>
    </SessionProvider>
  )
}
