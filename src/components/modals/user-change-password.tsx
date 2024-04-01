"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { changeUserPasswordSchema } from "@/lib/validations/user"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { type ChangeUserPasswordInputs } from "@/components/edit-user"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/modals/alert-modal.module.scss"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: ChangeUserPasswordInputs) => void
  loading: boolean
}

export const UserChangePassword: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = React.useState(false)

  const form = useForm<ChangeUserPasswordInputs>({
    resolver: zodResolver(changeUserPasswordSchema),
    defaultValues: {
      userId: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Modal
      title="Change password"
      description=""
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={styles["form-wrapper"]}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onConfirm)}>
            <div className={styles["form-container"]}>
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className={styles["form-item"]}>
                    <FormLabel className={styles["form-label"]}>
                      New password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={"Enter new password"}
                        className={styles["form-input"]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem className={styles["form-item"]}>
                    <FormLabel className={styles["form-label"]}>
                      Confirm new password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={"Confirm new password"}
                        className={styles["form-input"]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={styles["btn-group"]}>
              <Button
                disabled={loading}
                type={"button"}
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                {loading && (
                  <Icons.spinner
                    className={styles["icon"]}
                    aria-hidden="true"
                  />
                )}
                Change password
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  )
}
