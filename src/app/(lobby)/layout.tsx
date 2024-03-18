import { auth } from "@/server/auth/auth"

import { SiteHeader } from "@/components/layouts/site-header"
import styles from "@/styles/(lobby)/layout.module.scss"

interface LobbyLayoutProps {
  children: React.ReactNode
}

export default async function LobbyLayout({ children }: LobbyLayoutProps) {
  const user = await auth()

  return (
    <div className={styles["layout"]}>
      <SiteHeader user={user} />
      <main>{children}</main>
    </div>
  )
}
