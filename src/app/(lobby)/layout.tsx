import { currentUser } from "@/lib/auth/auth"
import { SiteHeader } from "@/components/layouts/site-header"
import styles from "@/styles/(lobby)/layout.module.scss"

interface LobbyLayoutProps {
  children: React.ReactNode
}

export default async function LobbyLayout({ children }: LobbyLayoutProps) {
  const user = await currentUser()

  return (
    <>
      <div className={styles["layout"]}>
        <SiteHeader user={user} />
        <main>{children}</main>
      </div>
    </>
  )
}
