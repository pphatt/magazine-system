import * as React from "react"
import { env } from "@/env"
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

const domain = env.NODE_ENV === "development" ? "http://localhost:3000" : ""

interface SetPasswordEmailProps {
  email: string
  token: string
}

export function SetPasswordEmail({ email, token }: SetPasswordEmailProps) {
  const setPasswordLink = `${domain}/set-password?token=${token}`

  return (
    <Html>
      <Head />
      <Preview>Set your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={text}>Click here to set a new password</Text>
            <Text style={text}>Your email is: {email}</Text>
            <Button style={button} href={setPasswordLink}>
              Set password
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "10px auto",
  width: "600px",
  maxWidth: "100%",
  border: "1px solid #E5E5E5",
  padding: "22px 40px",
}

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
}

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
}
