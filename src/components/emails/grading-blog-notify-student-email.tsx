import * as React from "react"
import type { User } from "@prisma/client"
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
} from "@react-email/components"
import { format } from "date-fns"

import { Icons } from "@/components/icons"

interface GradingBlogStudentNotifyEmailProps {
  blog: { title: string; status: string; gradedAt: Date }
  author: User
  marketingCoordinator: User
  blogUrl: string
}

export function GradingBlogStudentNotifyEmail({
  blog,
  author,
  marketingCoordinator,
  blogUrl,
}: GradingBlogStudentNotifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your contribution has been graded</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={track.container}>
            <Row>
              <Column>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  {author.image ? (
                    <span style={imageHolder}>
                      <Img src={author.image} style={image} />
                    </span>
                  ) : (
                    <span style={imageHolder}>
                      <Icons.user style={imagePlaceHolder} />
                    </span>
                  )}

                  <div
                    style={{
                      marginLeft: "0.5rem",
                    }}
                  >
                    <div style={authorName}>{author.name}</div>
                    <div style={authorId}>{author.id}</div>
                  </div>
                </div>
              </Column>
              <Column align="right">
                <Link style={global.button} href={blogUrl}>
                  View Contribution
                </Link>
              </Column>
            </Row>
          </Section>
          <Hr style={global.hr} />
          <Section style={global.defaultPadding}>
            <div style={descriptionTitle}>
              Title: <span style={{ fontWeight: "500" }}>{blog.title}</span>
            </div>
            <div style={descriptionTitle}>
              Grade:{" "}
              {blog.status === "APPROVE" && (
                <span
                  style={{
                    color: "hsl(180.54, 100%, 21.96%)",
                    backgroundColor: "hsl(180, 38.78%, 90.39%)",
                    display: "inline-flex",
                    alignItems: "center",
                    width: "fit-content",
                    borderRadius: "calc(0.5rem - 2px)",
                    padding: "0.125rem 0.625rem",
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                    fontWeight: "500",
                    textTransform: "capitalize",
                  }}
                >
                  {blog.status}
                </span>
              )}
              {blog.status === "PENDING" && (
                <span
                  style={{
                    color: "hsl(0, 70%, 40%)",
                    backgroundColor: "hsl(0, 100%, 97%)",
                    display: "inline-flex",
                    alignItems: "center",
                    width: "fit-content",
                    borderRadius: "calc(0.5rem - 2px)",
                    padding: "0.125rem 0.625rem",
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                    fontWeight: "500",
                    textTransform: "capitalize",
                  }}
                >
                  {blog.status}
                </span>
              )}
            </div>
            <div style={descriptionTitle}>
              Graded By:{" "}
              <span style={{ fontWeight: "500" }}>
                {marketingCoordinator.name}
              </span>
            </div>
            <div style={descriptionTitle}>
              Graded Date:{" "}
              <span style={{ fontWeight: "500" }}>
                {format(blog.gradedAt ?? new Date(), "PPP")}
              </span>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const paddingX = {
  paddingLeft: "40px",
  paddingRight: "40px",
}

const paddingY = {
  paddingTop: "22px",
  paddingBottom: "22px",
}

const paragraph = {
  margin: "0",
  lineHeight: "2",
}

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: "bold" },
  heading: {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "-1px",
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: "#747474",
    fontWeight: "500",
  },
  button: {
    border: "1px solid #929292",
    fontSize: "16px",
    textDecoration: "none",
    padding: "10px 0px",
    width: "200px",
    display: "block",
    textAlign: "center",
    fontWeight: 500,
    color: "#000",
  } as React.CSSProperties,
  hr: {
    borderColor: "#E5E5E5",
    margin: "0",
  },
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
}

const track = {
  container: {
    padding: "22px 40px",
    backgroundColor: "#F7F7F7",
  },
  number: {
    margin: "12px 0 0 0",
    fontWeight: 500,
    lineHeight: "1.4",
    color: "#6F6F6F",
  },
}

const imageHolder = {
  position: "relative",
  display: "flex",
  flexShrink: 0,
  width: "2.5rem",
  height: "2.5rem",
  borderRadius: "9999px",
  overflow: "hidden",
} as React.CSSProperties

const image = {
  objectFit: "cover",
  objectPosition: "center top",
  maxWidth: "100%",
  width: "100%",
  height: "100%",
  aspectRatio: "1 / 1",
} as React.CSSProperties

const imagePlaceHolder = {
  width: "100%",
  height: "100%",
} as React.CSSProperties

const authorName = {
  fontWeight: "700",
  cursor: "pointer",
} as React.CSSProperties

const authorId = {
  color: "#71717A",
  margin: 0,
  fontSize: "0.75rem",
} as React.CSSProperties

const descriptionTitle = {
  ...paragraph,
  fontSize: "15px",
  fontWeight: "bold",
}
