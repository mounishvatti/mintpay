"use server"
import { NextApiRequest, NextApiResponse } from "next";
import prisma  from "@/prisma/PrismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import store from "@/store/store";
import { setUsername } from "@/store/userSlice";

// Validation schema for login input
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string(),
  password: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Parse and validate the input
    const loginData = loginSchema.parse(req.body);

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginData.email },
          { username: loginData.username },
        ],
      },
    });

    // If user does not exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password || "",
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_USER_SECRET!, {
      expiresIn: "2d",
    });

    // Store the token in cookies (optional, for session-based auth)
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Secure; Path=/; Max-Age=172800`,
    );

    // If username is found, return the response with the token and the username's name

    store.dispatch(setUsername(loginData.username));
    
      return res.status(200).send({
        token,
        user: user.email,
      });
    
  } catch (error) {
    console.error("Error in login handler:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.errors,
      });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}