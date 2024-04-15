"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import type { UserWithFaculty } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import {
  editProfileSchema,
  type changeUserPasswordSchema,
} from "@/lib/validations/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { UserChangePassword } from "@/components/modals/user-change-password"
import styles from "@/styles/(settings)/_components/edit-profile.module.scss"

export type EditProfileInputs = z.infer<typeof editProfileSchema>

export type ChangeUserPasswordInputs = z.infer<typeof changeUserPasswordSchema>

interface EditUserProps {
  user: UserWithFaculty
}

export function EditProfile({ user }: EditUserProps) {
  const [openChangePassword, setOpenChangePassword] = React.useState(false)

  const [previewImage, setPreviewImage] = React.useState<string | null>(
    user.image
  )

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<EditProfileInputs>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      address: user.address ?? "",
      city: user.city ?? "",
      phoneNumber: user.phoneNumber ?? "",
    },
  })

  function onSubmit(data: EditProfileInputs) {
    const { image } = data

    const formData = new FormData()

    formData.set(
      "data",
      JSON.stringify({ userId: user.id, prevImage: user.image, ...data })
    )

    if (image) {
      formData.set("image", image)
    }

    startTransition(async () => {
      try {
        const req = await fetch("/api/user/edit-profile", {
          method: "POST",
          body: formData,
        })

        if (!req.ok) {
          let errorMessage = "Some went wrong try again later."

          try {
            const responseText = await req.text()

            errorMessage = responseText || errorMessage
          } catch (error) {
            toast.error("Error parsing response text", {
              description: String(error),
            })
          }

          toast.error(errorMessage)
          return
        }

        router.refresh()

        toast.success("Edit user profile successfully")
      } catch (e) {
        toast.error("Something went wrong. Try again!")
      }
    })
  }

  const onConfirmChangePassword = (data: ChangeUserPasswordInputs) => {
    const { newPassword, confirmNewPassword } = data

    startTransition(async () => {
      try {
        await fetch("/api/user/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            newPassword,
            confirmNewPassword,
          }),
        })

        setOpenChangePassword(false)
        router.refresh()

        toast("Change user's password successfully")
      } catch (e) {
        toast("Something went wrong. Try again!")
      }
    })
  }

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target

    if (!files) {
      return
    }

    const file = files[0]

    if (!file) {
      return
    }

    if (file.size > 5000000) {
      toast.warning("Max image size is 5MB.")
      return
    }

    const fileReader = new FileReader()

    fileReader.addEventListener("load", () => {
      setPreviewImage(fileReader.result as string)
    })

    fileReader.readAsDataURL(file)
  }

  return (
    <div className={styles["edit-user-wrapper"]}>
      <UserChangePassword
        isOpen={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        onConfirm={onConfirmChangePassword}
        loading={isPending}
      />

      <div className={styles["edit-user-container"]}>
        <div className={styles["user-wrapper"]}>
          <div className={styles["user-avatar"]}>
            <label
              htmlFor={"image"}
              style={{ display: "block" }}
              className={styles["avatar"]}
            >
              <Avatar className={styles["avatar"]}>
                <AvatarImage
                  src={previewImage ?? ""}
                  alt={""}
                  style={{
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() ?? ""}
                </AvatarFallback>
              </Avatar>
            </label>
            <div className={styles["user-text"]}>
              <h2>
                <span>{user.email}</span>
              </h2>
            </div>
          </div>
          <div className={styles["user-id-wrapper"]}>
            <div className={styles["user-id-text"]}>User ID</div>
            <div className={styles["user-id"]}>
              <span>{user.id}</span>
            </div>
          </div>
          <div className={styles["user-action"]}>
            <Button
              className={styles["change-password-btn"]}
              onClick={() => setOpenChangePassword(true)}
            >
              <Icons.lock />
              <span>Change password</span>
            </Button>
          </div>
          <div className={styles["created-at"]}>
            Joined on <span>{format(user.createdAt, "PPP")}</span>
          </div>
        </div>
        <div className={styles["details-card-wrapper"]}>
          <Card className={styles["details-card"]}>
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>
                Manage personal information settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  encType={"multipart/form-data"}
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className={styles["form-container"]}>
                    <div className={styles["disabled-input-container"]}>
                      <label className={styles["disabled-input-label"]}>
                        Email
                      </label>
                      <Input
                        disabled={true}
                        className={styles["disabled-input"]}
                        value={user.email ?? "-"}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className={styles["form-item"]}>
                          <FormLabel className={styles["form-label"]}>
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={"Enter Faculty's name"}
                              className={styles["form-input"]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className={styles["disabled-input-container"]}>
                      <label className={styles["disabled-input-label"]}>
                        Faculty
                      </label>
                      <Input
                        disabled={true}
                        className={styles["disabled-input"]}
                        value={user.faculty?.name ?? "-"}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className={styles["form-item"]}>
                          <FormLabel className={styles["form-label"]}>
                            Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={"Enter address"}
                              className={styles["form-input"]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className={styles["form-item"]}>
                          <FormLabel className={styles["form-label"]}>
                            City
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={"Enter city"}
                              className={styles["form-input"]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className={styles["form-item"]}>
                          <FormLabel className={styles["form-label"]}>
                            Phone number
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={"Enter phone number"}
                              className={styles["form-input"]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image"
                      render={({
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        field: { value, onChange, ...fieldProps },
                      }) => (
                        <FormItem
                          className={cn(
                            styles["form-item"],
                            styles["image-input"]
                          )}
                        >
                          <FormControl>
                            <Input
                              {...fieldProps}
                              type={"file"}
                              accept={"image/png, image/jpg, image/jpeg"}
                              className={styles["avatar-input"]}
                              id={"image"}
                              onChange={(event) => {
                                handleSelectImage(event)
                                onChange(
                                  event.target.files && event.target.files[0]
                                )
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className={styles["submit-btn"]}
                  >
                    {isPending && (
                      <Icons.spinner
                        className={styles["icon"]}
                        aria-hidden="true"
                      />
                    )}
                    <span>Save changes</span>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
