import { auth } from "@/server/auth/auth"

import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"
import styles from "@/styles/(lobby)/layout.module.scss"

interface LobbyLayoutProps {
  children: React.ReactNode
}

export default async function LobbyLayout({ children }: LobbyLayoutProps) {
  const user = await auth()

  return (
    <>
      <div className={styles["layout"]}>
        <SiteHeader user={user} />
        <main
          style={{
            flex: "1",
            height: "100%",
            minHeight: "calc(100vh - 85px)",
          }}
        >
          {children}
        </main>
        <SiteFooter />
      </div>
    </>
  )
}
