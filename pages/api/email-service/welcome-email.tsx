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

interface WelcomeEmailProps {
    username: string;
    company?: string;
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
    username,
    company = "mintpay",
}) => {
    const previewText = `Thank you for signing up, ${username}! Experience easy payments with ${company}.`;

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
                            Welcome to <strong>{company}</strong>, {username}!
                        </Heading>
                        <Text className="text-2xl">
                            Hello {username},
                        </Text>
                        <Text className="text-xl">
                            We're thrilled to have you with us at{" "}
                            <strong>{company}</strong>. With us, enjoy making easy payments within seconds. Let's make your transactions faster and smoother!
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#6A0DAD] rounded text-white text-xl font-semibold no-underline text-center px-4 py-2"
                                href={`${baseUrl}/get-started`}
                            >
                                Get Started
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

export default WelcomeEmail;