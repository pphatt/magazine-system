import * as z from "zod"

export const authSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"),
      {
        message:
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      }
    ),
})

export const checkEmailSchema = z.object({
  email: authSchema.shape.email,
})

export const changeUserNameSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Please use 4 characters at minimum.",
    })
    .max(32, {
      message: "Please use 32 characters at maximum.",
    }),
})

export const setPasswordSchema = z
  .object({
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  })
