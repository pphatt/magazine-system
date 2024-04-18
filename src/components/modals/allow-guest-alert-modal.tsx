"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/modals/alert-modal.module.scss"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  status: boolean
}

export const AllowGuestAlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  status,
}) => {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Modal
      title="Guest permission"
      description="Guest permission action can be edit."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={styles["wrapper"]}>
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="custom"
          onClick={onConfirm}
          className={styles["accept"]}
          data-permission={status}
        >
          {loading && (
            <Icons.spinner className={styles["icon"]} aria-hidden="true" />
          )}
          {!status ? "Allow guest to view" : "Not allow guest to view"}
        </Button>
      </div>
    </Modal>
  )
}
