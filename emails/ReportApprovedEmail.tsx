import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ReportApprovedEmailProps {
  reportId: string;
  unsubscribeUrl: string;
}

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const ReportApprovedEmail = ({
  reportId,
  unsubscribeUrl,
}: ReportApprovedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your report has been approved!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/_next/image?url=%2Flogo.png&w=48&q=75`}
          width="48"
          height="48"
          alt="Haux Alerte Logo"
        />
        <Heading style={h1}>Report Approved</Heading>
        <Text style={text}>
          Great news! Your report with ID {reportId} has been approved by an
          administrator. Thank you for helping us improve our community.
        </Text>
        <Text style={text}>
          You can view your report on the map by clicking the link below:
        </Text>
        <Link
          href={`${baseUrl}/?reportId=${reportId}`}
          style={button}
        >
          View Report
        </Link>
        <Text style={footer}>
          Don't want to receive these notifications?{" "}
          <Link href={unsubscribeUrl} style={link}>
            Unsubscribe
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ReportApprovedEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "20px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "5px",
  padding: "20px",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  lineHeight: "24px",
};

const button = {
  backgroundColor: "#007bff",
  borderRadius: "5px",
  color: "#fff",
  fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 20px",
};

const footer = {
  color: "#8898aa",
  fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  fontSize: "12px",
  lineHeight: "16px",
  marginTop: "20px",
};

const link = {
  color: "#8898aa",
  textDecoration: "underline",
};
