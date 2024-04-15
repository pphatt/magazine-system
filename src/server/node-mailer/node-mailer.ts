import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "greenwich.magazine.edu@gmail.com",
    pass: "xbfo uggj gbpc zyeh",
  },
})
