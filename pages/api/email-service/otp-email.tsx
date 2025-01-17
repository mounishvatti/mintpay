import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import * as React from "react";

interface OTPEmailProps {
    username: string;
    otp: string;
    company?: string;
}

const OTPEmail: React.FC<OTPEmailProps> = ({
    username,
    otp,
    company = "Rupay",
}) => {
    const previewText = `Your OTP for ${company} is ${otp}.`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="my-10 mx-auto p-5 w-[465px]">
                        <Section className="mt-8">
                            <Img
                                src={`${baseUrl}/dwnapxhev/image/upload/v1737111044/rupay_banner_rzkx7f.avif`}
                                alt="Logo Example"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-3xl font-normal text-center p-0 my-8 mx-0">
                            Your OTP for <strong>{company}</strong>
                        </Heading>
                        <Text className="text-2xl">
                            Hello {username},
                        </Text>
                        <Text className="text-xl">
                            Your One-Time Password (OTP) for logging in to <strong>{company}</strong> is:
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Heading className="text-4xl font-bold text-[#6A0DAD]">{otp}</Heading>
                        </Section>
                        <Text className="text-xl">
                            Please use this OTP to complete your login process. It is valid for a limited time only.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#6A0DAD] rounded text-white text-xl font-semibold no-underline text-center px-4 py-2"
                                href={`${baseUrl}/login`}
                            >
                                Go to Login
                            </Button>
                        </Section>
                        <Text className="text-xl">
                            Cheers,
                            <br />
                            The {company} Team
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

const baseUrl = process.env.URL ? `https://${process.env.URL}` : "http://localhost:3000";

export default OTPEmail;