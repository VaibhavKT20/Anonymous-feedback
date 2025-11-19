import {
  Html,
  Head,
  Preview,
  Heading,
  Text,
  Link,
  Body,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  BASE_URL: string;
  username: string;
  otp: string;
}

export default function VerificationEmail({
  BASE_URL,
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>Verification Code</title>
      </Head>

      <Preview>Your verification code: {otp}</Preview>

      <Body style={{ fontFamily: "Arial, sans-serif" }}>
        <Container style={{ padding: "20px" }}>
          <Heading>Hello {username},</Heading>

          <Text>
            Thank you for registering. Use the verification code below to
            complete your registration:
          </Text>

          <Heading as="h3">{otp}</Heading>

          <Text>This code will expire in 15 minutes.</Text>

          <Text>
            Click the link below to verify your account:
          </Text>

          <Link
            href={`${BASE_URL}/verify/${username}`}
            style={{
              color: "#007bff",
              textDecoration: "underline",
              fontSize: "16px",
            }}
          >
            Verify Here
          </Link>

          <Text>If you did not request this code, please ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  );
}
