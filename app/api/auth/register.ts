import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { z } from "zod";
import prisma  from "@/prisma/PrismaClient"; 

import { Resend } from 'resend';

const resend = new Resend("RESEND_API_KEY");

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    // Create a new user
    await prisma.user.create({
      data: {
        name: signupData.name,
        email: signupData.email,
        password: hashedPassword,
      },
    });
    try{
      resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'signupData.email',
        subject: `Hello ${signupData.name}`,
        html: '<p>Thank you for signing up!</p>'
      });
    } catch{
      console.log("error sending email");
    }
    // Respond with success message
    return res.status(201).json({
      message: "Account created successfully"
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