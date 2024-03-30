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
    phoneNumber: z
      .string()
      .regex(new RegExp("^[0-9]{6,15}(-[0-9])?$"), {
        message: "Phone must be contain only number",
      })
      .min(10, {
        message: "Enter a valid phone number",
      })
      .max(11, {
        message: "Maximum digits of a phone number is 11",
      }),
  })
  .refine(
    ({ role, faculty }) => {
      if (role === "STUDENT" || role === "MARKETING_COORDINATOR") {
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

export const getUserWithFacultySchema = z.object({
  query: z.string().default("undefined"),
  pageNumber: z.number().default(1),
  rowsNumber: z.number().default(50),
})
