import * as React from "react"
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"

interface SubmitBlogEmailProps {
  id: string
  title: string
  uploadedAt: string
  faculty: string
  academicYear: string
  blogUrl: string
}

export function SubmitBlogEmail({
  id,
  title,
  uploadedAt,
  faculty,
  academicYear,
  blogUrl,
}: SubmitBlogEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Wait around 14 days to get accepted</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={track.container}>
            <Row>
              <Column>
                <Text style={global.paragraphWithBold}>Contribution ID number</Text>
                <Text style={track.number}>{id}</Text>
              </Column>
              <Column align="right">
                <Link style={global.button} href={blogUrl}>
                  View Contribution
                </Link>
              </Column>
            </Row>
          </Section>
          <Hr style={global.hr} />
          <Section style={message}>
            <Heading style={global.heading}>
              Submitted contribution successfully
            </Heading>
            <Text style={global.text}>
              Wait around 14 days to get accepted.
            </Text>
          </Section>
          <Hr style={global.hr} />
          <Section style={global.defaultPadding}>
            <div style={descriptionTitle}>
              Title: <span style={{ fontWeight: "500" }}>{title}</span>
            </div>
            <div style={descriptionTitle}>
              Upload Date:{" "}
              <span style={{ fontWeight: "500" }}>{uploadedAt}</span>
            </div>
            <div style={descriptionTitle}>
              Faculty: <span style={{ fontWeight: "500" }}>{faculty}</span>
            </div>
            <div style={descriptionTitle}>
              Academic Year:{" "}
              <span style={{ fontWeight: "500" }}>{academicYear}</span>
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
    width: "220px",
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

const message = {
  padding: "40px 74px",
  textAlign: "center",
} as React.CSSProperties

const descriptionTitle = {
  ...paragraph,
  fontSize: "15px",
  fontWeight: "bold",
}
