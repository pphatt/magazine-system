import * as z from "zod"

export const addUserSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .regex(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
        ),
        {
          message:
            "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
        }
      ),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .regex(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
        ),
        {
          message:
            "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
        }
      ),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    role: z.string().min(1, { message: "User's role must be assigned" }),
    faculty: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
  })
  .refine(
    ({ role, faculty }) => {
      if (role === "student" || role === "marketing coordinator") {
        return faculty !== undefined && faculty.trim() !== ""
      }

      return true
    },
    {
      message: "Faculty is required for student and marketing coordinator",
      path: ["faculty"],
    }
  )
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Confirm password must match password",
    path: ["confirmPassword"],
  })
