"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/modals/alert-modal.module.scss"

interface DeleteContributionAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

export const DeleteContributionAlertModal: React.FC<DeleteContributionAlertModalProps> = ({
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
      title="Delete contribution"
      description="Delete contribution action cannot be undo."
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
        >
          {loading && (
            <Icons.spinner className={styles["icon"]} aria-hidden="true" />
          )}
          Delete
        </Button>
      </div>
    </Modal>
  )
}
