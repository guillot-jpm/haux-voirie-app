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

interface ReportResolvedEmailProps {
  reportId: string;
  unsubscribeUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const ReportResolvedEmail = ({
  reportId,
  unsubscribeUrl,
}: ReportResolvedEmailProps) => (
  <Html>
    <Head />
    <Preview>Votre signalement a été résolu !</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="48"
          height="48"
          alt="Haux Alerte Logo"
        />
        <Heading style={h1}>Signalement Résolu</Heading>
        <Text style={text}>
          Bonne nouvelle ! Votre signalement n°{reportId} a été marqué comme
          résolu par un administrateur. Le problème a été pris en compte.
        </Text>
        <Text style={text}>
          Merci de votre contribution à l&apos;amélioration de notre commune.
        </Text>
        <Text style={footer}>
          Vous ne souhaitez plus recevoir ces notifications ?{" "}
          <Link href={unsubscribeUrl} style={link}>
            Se désinscrire
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ReportResolvedEmail;

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
