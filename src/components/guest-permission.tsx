"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { guestPermission } from "@/lib/actions/blog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AllowGuestAlertModal } from "@/components/modals/allow-guest-alert-modal"
import styles from "@/styles/components/guest-permission.module.scss"

interface GuestPermissionProps {
  blogId: string
  status: boolean
}

export function GuestPermission({ blogId, status }: GuestPermissionProps) {
  const [openAllowed, setOpenAllowed] = React.useState(false)

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onSubmit = () => {
    startTransition(async () => {
      try {
        const payload = {
          blogId,
          status: !status,
        }

        const req = await guestPermission(payload)

        if ("success" in req) {
          router.refresh()
          if (status) {
            toast.success(
              "Not allow guest to view blog successfully. Now guest cannot view this blog."
            )
          } else {
            toast.success(
              "Allow guest successfully. Now guest can view this blog."
            )
          }
          setOpenAllowed(false)
        } else {
          toast.error(req.error)
        }
      } catch (e) {
        toast.error("Something went wrong. Try again!")
      }
    })
  }

  return (
    <div className={styles["allow-guest-wrapper"]}>
      <AllowGuestAlertModal
        isOpen={openAllowed}
        onClose={() => setOpenAllowed(false)}
        onConfirm={onSubmit}
        loading={isPending}
        status={status}
      />

      <Button
        className={styles["btn"]}
        disabled={isPending}
        onClick={() => setOpenAllowed(true)}
        data-permission={status}
      >
        {isPending && (
          <Icons.spinner className={styles["icon"]} aria-hidden="true" />
        )}
        {!status ? "Guest can view this" : "Guest cannot view this"}
      </Button>
    </div>
  )
}
