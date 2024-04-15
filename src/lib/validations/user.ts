import * as z from "zod"

const MAX_FILE_SIZE = 5000000
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

export const addUserSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
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

export const editUserSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1, { message: "User's name is required" }),
  address: z.string().min(1, { message: "User's address is required" }),
  role: z.string().min(1, { message: "User's role must be assigned" }),
  faculty: z.string().optional(),
  city: z.string().min(1, { message: "User's city is required" }),
  prevImage: z.string().optional(),
  image: z
    .custom<File>((val) => val instanceof File, "Please upload a file")
    .refine((file) => file?.size <= MAX_FILE_SIZE)
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Please choose .jpg, .jpeg and .png format files only",
    })
    .optional(),
  phoneNumber: z
    .string()
    .regex(new RegExp("^[0-9]{6,15}(-[0-9])?$"), {
      message: "Phone must be contain only number",
    })
    .min(10, {
      message: "Minimum digits of a phone number is 11",
    })
    .max(11, {
      message: "Maximum digits of a phone number is 11",
    }),
})

export const deleteUserSchema = z.object({
  userId: z.string(),
})

export const changeUserPasswordSchema = z
  .object({
    userId: z.string(),
    newPassword: z
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
    confirmNewPassword: z
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
  })
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword,
    {
      message: "Confirm new password must match new password",
      path: ["confirmNewPassword"],
    }
  )

export const getUserWithFacultySchema = z.object({
  query: z.string().default("undefined"),
  pageNumber: z.number().default(1),
  rowsNumber: z.number().default(50),
})

export const editProfileSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1, { message: "User's name is required" }),
  address: z.string().min(1, { message: "User's address is required" }),
  city: z.string().min(1, { message: "User's city is required" }),
  prevImage: z.string().optional(),
  image: z
    .custom<File>((val) => val instanceof File, "Please upload a file")
    .refine((file) => file?.size <= MAX_FILE_SIZE)
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Please choose .jpg, .jpeg and .png format files only",
    })
    .optional(),
  phoneNumber: z
    .string()
    .regex(new RegExp("^[0-9]{6,15}(-[0-9])?$"), {
      message: "Phone must be contain only number",
    })
    .min(10, {
      message: "Minimum digits of a phone number is 11",
    })
    .max(11, {
      message: "Maximum digits of a phone number is 11",
    }),
})
