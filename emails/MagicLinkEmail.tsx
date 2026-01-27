import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface MagicLinkEmailProps {
  url: string;
}

export const MagicLinkEmail = ({ url }: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Votre lien de connexion à Haux Alerte</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Se connecter à Haux Alerte</Heading>
        <Text style={text}>
          Cliquez sur le bouton ci-dessous pour vous connecter.
        </Text>
        <Button
          style={button}
          href={url}
        >
          Se connecter
        </Button>
        <Text style={text}>
          Si vous n&apos;avez pas demandé ce lien, vous pouvez ignorer cet e-mail en toute sécurité.
        </Text>
        <Text style={{ ...text, marginTop: "14px", marginBottom: "16px" }}>
          Haux Alerte
        </Text>
      </Container>
    </Body>
  </Html>
);

MagicLinkEmail.PreviewProps = {
  url: "https://haux-alerte.fr/api/auth/callback/email?callbackUrl=/&token=mock-token&email=mock@example.com",
} as MagicLinkEmailProps;

export default MagicLinkEmail;

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const h1 = {
  color: "#000000",
  fontSize: "24px",
  fontWeight: "normal",
  textAlign: "center" as const,
  margin: "30px 0",
  padding: "0",
};

const link = {
  color: "#007bff",
  textDecoration: "underline",
};

const text = {
  color: "#000000",
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
  margin: "16px 0",
};
