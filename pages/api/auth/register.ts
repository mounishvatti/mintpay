"use server";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { z } from "zod";
import prisma from "@/prisma/PrismaClient";
import WelcomeEmail from "../email-service/welcome-email";
import { Resend } from "resend";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(
  email: string,
  subject: string,
  body: React.ReactElement,
) {
  try {
    resend.emails.send({
      from: "mintpay <onboarding@resend.dev>",
      to: "delivered@resend.dev",
      subject: subject,
      react: body,
      //scheduledAt: "in 1 min",
    });
  } catch (error) {
    console.log("error sending email");
  }
}

const signupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Validate the request body
    const signupData = signupSchema.parse(req.body);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: signupData.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let username = `${signupData.first_name}${signupData.last_name}`
      .toLowerCase();
    // Hash the password
    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    // Create a new user
    await prisma.user.create({
      data: {
        first_name: signupData.first_name,
        last_name: signupData.last_name,
        username: username,
        email: signupData.email,
        password: hashedPassword,
      },
    });

    // Send a welcome email
    await sendEmail(
      "delivered@resend.dev",
      "Thank you for registering with mintpay",
      React.createElement(WelcomeEmail, {
        username: signupData.first_name,
        company: "mintpay",
      }),
    );

    // Respond with success message
    return res.status(201).json({
      message: "Account created successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        message: "Validation Error",
        errors: error.errors,
      });
    }

    console.error("Error during sign-up:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
