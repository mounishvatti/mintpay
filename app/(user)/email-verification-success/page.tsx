"use client";
import store from "@/app/store/store";

import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationSuccessProps {
    username: string;
    company?: string;
}

const VerificationSuccess: React.FC<VerificationSuccessProps> = ({
    company = "Rupay",
}) => {
    const previewText = `Your email has been successfully verified with ${company}.`;
    const username = store.getState().user.username;

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
                            Your email has been successfully verified
                        </Heading>
                        <Text className="text-2xl">
                            Hello {username},
                        </Text>
                        <Text className="text-xl">
                            Congratulations! Your email has been successfully verified with <strong>{company}</strong>.
                        </Text>
                        <Text className="text-xl">
                            You're all set to start using our platform and enjoy seamless payments within seconds.
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

export default VerificationSuccess;