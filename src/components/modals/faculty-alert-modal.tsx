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
}

export const FacultyAlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
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
      title="Delete faculty"
      description="Delete faculty action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={styles["wrapper"]}>
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          {loading && (
            <Icons.spinner className={styles["icon"]} aria-hidden="true" />
          )}
          Continue
        </Button>
      </div>
    </Modal>
  )
}
